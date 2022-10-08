const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verify-jwt');
const verifyRole = require('../middleware/verify-roles')

const categoryController = require("../controllers/category/categoryController");

router.post('/create/category', verifyToken, verifyRole('admin'), categoryController.create_category);
router.delete('/delete/:categoryId/category', verifyToken, verifyRole('admin'), categoryController.delete_category);


module.exports = router;