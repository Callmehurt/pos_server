const Orders = require('../../models/Orders');
const CashFlow = require('../../models/CashFlow');


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

exports.debit_credit_record = async (req, res) => {
    try{

        const data = await CashFlow.aggregate([
            {
                $group: {
                    _id: {$dateToString: { format: "%Y-%m-%d", date: "$createdAt" }},
                    debit: {
                        $sum : {
                            $cond: [{$eq: ['$operation', 'debit']}, '$value', 0]
                        }
                    },
                    credit: {
                        $sum : {
                            $cond: [{$eq: ['$operation', 'credit']}, '$value', 0]
                        }
                    }
                }
            },
            { $sort: {_id: -1} },
            { $limit: 10 },
        ])

        res.status(200).json(data)

    }catch (e) {
        return res.status(500).json(e)
    }
}

