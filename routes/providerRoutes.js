const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verify-jwt');
const verifyRole = require('../middleware/verify-roles')

const providerController = require('../controllers/provider/providerController');

router.post('/create/provider', verifyToken, verifyRole('admin'), providerController.create_provider);
router.get('/fetch/providers', verifyToken, verifyRole('admin'), providerController.fetch_providers_data);
router.delete('/delete/:providerId/provider', verifyToken, verifyRole('admin'), providerController.delete_provider);
router.put('/update/provider', verifyToken, verifyRole('admin'), providerController.update_provider);


module.exports = router;