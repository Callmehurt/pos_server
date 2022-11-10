const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-jwt');
const verifyRole = require('../middleware/verify-roles');


const productController = require('../controllers/product/productController');
const stockManagementController = require('../controllers/product/stockManagementController');


router.post('/create/product', verifyToken, verifyRole(['admin']), productController.create_product);
router.get('/fetch/products', verifyToken, verifyRole(['admin']), productController.fetch_products);
router.delete('/delete/:productId/product', verifyToken, verifyRole(['admin']), productController.delete_product);
router.put('/update/product', verifyToken, verifyRole(['admin']), productController.update_product);
router.get('/fetch/:categoryId/products', verifyToken, verifyRole(['admin', 'staff']), productController.fetch_category_specific_product);

router.get('/search/products', verifyToken, verifyRole(['admin']), stockManagementController.get_searched_products);
router.post('/adjust-stock', verifyToken, verifyRole(['admin']), stockManagementController.adjust_stock);
router.get('/fetch/stock-flow', verifyToken, verifyRole(['admin']), stockManagementController.fetch_stock_flow);
router.delete('/delete/:recordId/stock-flow', verifyToken, verifyRole(['admin']), stockManagementController.delete_stock_flow_record);

module.exports = router;

