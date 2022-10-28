const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verify-jwt');
const verifyRole = require('../middleware/verify-roles');

const orderController = require('../controllers/order/orderController');


router.get('/fetch/ongoing-orders', verifyToken, verifyRole(['staff']), orderController.fetchOngoingOrders);
router.get('/search/products', verifyToken, verifyRole(['staff']), orderController.search_products);


module.exports = router;