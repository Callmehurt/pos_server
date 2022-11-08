const Orders = require('../../models/Orders');


exports.order_total_detail = async (req, res) => {
    try{

        const orders = await Orders.aggregate([
            {
                $group: {
                    _id: {$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }},
                    totalCollectable: {$sum: {$toInt: '$subTotal'}},
                    totalDiscount: {$sum: '$discountAmount'},
                    totalCollected: {$sum: {$toInt: '$total'}},
                    sum: {$sum: 1}
                }
            },
            { $sort: {_id: -1} },
            { $limit: 10 },
        ]);

        res.status(200).json(orders)


    }catch (e) {
        return res.status(500).json(e)
    }
}

