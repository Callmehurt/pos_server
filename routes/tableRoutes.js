const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verify-jwt');
const verifyRole = require('../middleware/verify-roles');


const tableController = require('../controllers/table/tableController');

router.post('/create/table', verifyToken, verifyRole('admin'), tableController.create_table);
router.get('/fetch/tables', verifyToken, verifyRole('admin'), tableController.fetch_tables);
router.delete('/delete/:tableId/table', verifyToken, verifyRole('admin'), tableController.delete_table);
router.put('/update/table', verifyToken, verifyRole('admin'), tableController.update_table);


module.exports = router;

