const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-jwt');
const verifyRole = require('../middleware/verify-roles');

const dashboardDetailController = require('../controllers/dashboard/dashboardDetailController');


router.get('/fetch/order-total', verifyToken, verifyRole(['admin']), dashboardDetailController.order_total_detail);
router.get('/fetch/debit-credit', verifyToken, verifyRole(['admin']), dashboardDetailController.debit_credit_record);

module.exports = router;