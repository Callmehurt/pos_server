const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-jwt');
const verifyRole = require('../middleware/verify-roles');


const expenseController = require('../controllers/expenses/expenseController');

router.post('/register/expense', verifyToken, verifyRole(['admin']), expenseController.register_expenses);
router.delete('/delete/:expenseId/expense', verifyToken, verifyRole(['admin']), expenseController.delete_expense);
router.put('/update/expense', verifyToken, verifyRole(['admin']), expenseController.update_expense);


module.exports = router;