const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verify-jwt');
const verifyRole = require('../middleware/verify-roles')

const procurementController = require('../controllers/procurement/procurementController');

router.post('/register/procurement', verifyToken, verifyRole('admin'), procurementController.register_procurement);
router.get('/fetch/procurements', verifyToken, verifyRole('admin'), procurementController.fetch_procurements);
router.put('/update/procurement', verifyToken, verifyRole('admin'), procurementController.update_procurement);
router.delete('/delete/:procurementId/procurement', verifyToken, verifyRole('admin'), procurementController.delete_procurement);

module.exports = router;