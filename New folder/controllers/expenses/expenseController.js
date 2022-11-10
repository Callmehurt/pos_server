const Expenses = require('../../models/Expenses');
const CashFlow = require('../../models/CashFlow');
const mongoose = require('mongoose');


exports.register_expenses = async (req, res) => {
    try{

        const {name, value} = req.body;

        const newExpense = new Expenses({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            value: value
        })

        try{
            await newExpense.save();

            const cashFlow = new CashFlow({
                _id: new mongoose.Types.ObjectId(),
                name: newExpense.name,
                value: newExpense.value,
                operation: 'debit',
            });
            await cashFlow.save();

            res.status(200).json({
                message: 'Expense added',
                expense: newExpense
            });
        }catch (e) {
            return res.status(500).json(e)
        }

    }catch (e) {
        return res.status(500).json(e)
    }
}

exports.update_expense = async (req, res) => {
    try{
        const {expenseId, ...other} = req.body;

        const updatedExpense = await Expenses.findByIdAndUpdate(expenseId, other, {
            returnOriginal: false
        });
        res.status(200).json({
            message: 'Expense update',
            expense: updatedExpense
        });
    }catch (e) {
        return res.status(500).json(e)
    }
}

exports.delete_expense = async (req, res) => {
    try{

        const expenseId = req.params.expenseId;
        await Expenses.findByIdAndDelete(expenseId);

        res.status(200).json({
            message: 'Expense deleted successfully'
        })

    }catch (e) {
        return res.status(500).json(e)
    }
}