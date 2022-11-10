const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verify-jwt');
const verifyRole = require('../middleware/verify-roles');

const orderController = require('../controllers/order/orderController');


router.get('/fetch/all/orders', verifyToken, verifyRole(['staff', 'admin']), orderController.fetchOrders);
router.get('/search/products', verifyToken, verifyRole(['staff']), orderController.search_products);
router.post('/setup/order', verifyToken, verifyRole(['staff']), orderController.setup_order);
router.get('/fetch/orders', verifyToken, verifyRole(['staff', 'admin']), orderController.fetchSpecificOrders);
router.delete('/delete/:orderId/order', verifyToken, verifyRole(['staff', 'admin']), orderController.deleteOrder);


module.exports = router;