const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verify-jwt');
const verifyRole = require('../middleware/verify-roles')

const categoryController = require("../controllers/category/categoryController");

router.post('/create/category', verifyToken, verifyRole(['admin']), categoryController.create_category);
router.delete('/delete/:categoryId/category', verifyToken, verifyRole(['admin']), categoryController.delete_category);
router.get('/fetch/categories', verifyToken, verifyRole(['admin', 'staff']), categoryController.fetch_categories);
router.put('/update/category', verifyToken, verifyRole(['admin']), categoryController.update_category);
router.get('/fetch/child/:parentId/category', verifyToken, verifyRole(['admin', 'staff']), categoryController.fetch_child_categories);


module.exports = router;