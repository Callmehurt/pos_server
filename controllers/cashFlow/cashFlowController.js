const CashFlow = require('../../models/CashFlow');
const mongoose = require('mongoose')

exports.fetch_cash_flow = async (req, res) => {
    try {

        const data = await CashFlow.find().sort({createdAt: -1});

        res.status(200).json(data)

    }catch (e) {
        return res.status(500).json(e);
    }
}

exports.fetch_dated_cash_flows = async (req, res) => {
    try{
        const {start, end} = req.body;
        const startDate = new Date(start);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(end);
        endDate.setHours(0, 0, 0, 0);
        const data = await CashFlow.find({createdAt: {
            $gte: startDate.getTime(),
            $lt: endDate.getTime(),
            }});

        res.status(200).json(data)
    }catch (e){
        return res.status(500).json(e)
    }
}