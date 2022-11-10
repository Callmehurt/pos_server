const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verify-jwt');
const verifyRole = require('../middleware/verify-roles');

const unitController = require('../controllers/units/unitController');


router.post('/create/unit-group', verifyToken, verifyRole(['admin']), unitController.create_unit_group);
router.delete('/delete/:unitGroupId/unit-group', verifyToken, verifyRole(['admin']), unitController.delete_unit_group);
router.get('/fetch/unit-group', verifyToken, verifyRole(['admin']), unitController.fetch_unit_group);
router.post('/create/unit', verifyToken, verifyRole(['admin']), unitController.create_unit);
router.put('/update/unit', verifyToken, verifyRole(['admin']), unitController.update_unit);
router.delete('/delete/:unitId/unit', verifyToken, verifyRole(['admin']), unitController.delete_unit);
router.get('/fetch/units', verifyToken, verifyRole(['admin']), unitController.fetch_units);


module.exports = router;
