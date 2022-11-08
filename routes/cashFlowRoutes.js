const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-jwt');
const verifyRole = require('../middleware/verify-roles');

const cashFlowController = require('../controllers/cashFlow/cashFlowController');


router.get('/fetch/cash-flows', verifyToken, verifyRole(['admin']), cashFlowController.fetch_cash_flow);
router.post('/fetch/cash-flows', verifyToken, verifyRole(['admin']), cashFlowController.fetch_dated_cash_flows);


module.exports = router;