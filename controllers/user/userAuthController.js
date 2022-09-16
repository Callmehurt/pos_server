const User = require('../../models/User')

const mongoose = require('mongoose')
const CryptoJS = require('crypto-js')
const jwt = require('jsonwebtoken')

exports.register_user =  async (req, res, next) => {
    const user = await User.find({username: req.body.username});
    if(user.length >= 1){
        return res.status(409).json({
            message: 'User with this username is already registered'
        })
    }else {
        const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            username: req.body.username,
            password: CryptoJS.AES.encrypt(req.body.password,process.env.PASS_SECRET)
        })
        try {
            await newUser.save();
            res.status(200).json({
                message: 'User created successfully',
                data: newUser
            })
        }catch (e){
            console.log(e)
            res.status(500).json(e)
        }
    }
}

exports.login_user = async (req, res) => {
    try{
        const user = await User.findOne({username: req.body.username});

        if(!user){
            return res.status(401).json({
                message: 'Invalid Credentials'
            })
        }

        const hashPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SECRET
        );

        const userPassword = hashPassword.toString(CryptoJS.enc.Utf8);
        if(userPassword !== req.body.password){
            return res.status(401).json({
                message: 'Invalid Credentials'
            })
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.ACCESS_SECRET,
            {expiresIn: '200s'}
        )

        const refreshToken = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.REFRESH_SECRET,
            {expiresIn: '1d'}
        )
        user.refresh_token = refreshToken;
        user.save();
        const {password,refresh_token, ...others} = user._doc;
        // , secure: true
        res.cookie('jwt', refreshToken, {httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000})
        res.status(200).json({
            user: others,
            access_token: accessToken,
            refresh_token: refreshToken
        })

    }catch (e){
        res.status(500).json(e)
    }
}

exports.refresh_token = async (req, res) => {
    const cookie = req.cookies;
    if(!cookie?.jwt){
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }

    const refreshToken = cookie.jwt;
    const foundUser = await User.findOne({refresh_token: refreshToken});
    if(!foundUser){
        return res.status(403).json({
            message: 'Invalid token'
        })
    }
    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET,
        (err, decoded) => {
            if(err || foundUser.id !== decoded.id){
                return res.status(403).json({
                    message: 'Invalid token'
                })
            }else {
                const accessToken = jwt.sign(
                    {
                        id: decoded.id,
                        role: decoded.role
                    },
                    process.env.ACCESS_SECRET,
                    {expiresIn: '200s'}
                )

                const {password,refresh_token, ...others} = foundUser._doc;
                res.status(200).json({
                    user: others,
                    access_token: accessToken
                })
            }
        }
    )
}

exports.logout_user = async (req, res) => {
    //on client, also delete the access token
    const cookie = req.cookies;
    if(!cookie?.jwt){
        return res.sendStatus(204)
    }

    const refreshToken = cookie.jwt;
    const foundUser = await User.findOne({refresh_token: refreshToken});
    if(!foundUser){
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
        return res.sendStatus(204);
    }

    foundUser.refresh_token = '';
    foundUser.save();
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
    res.sendStatus(200);
}
