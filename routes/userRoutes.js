const express = require('express')
const router = express.Router();

//middlewares
const verifyJWT = require('../middleware/verify-jwt')
const verifyRole = require('../middleware/verify-roles');

//controllers
const userAuthController = require('../controllers/user/userAuthController')

router.post('/register', userAuthController.register_user);
router.post('/login', userAuthController.login_user);
router.get('/refresh-token', userAuthController.refresh_token)
router.get('/logout', userAuthController.logout_user)

router.get('/try',async (req, res) => {
    res.status(200).json({
        message: 'Okay'
    })
})
router.get('/test', verifyJWT, verifyRole('admin'), async (req, res) => {
    res.status(200).json({
        message: 'Okay',
    })
})
module.exports = router;