const jwt = require('jsonwebtoken');
require('dotenv').config();


const verifyJWT = (req, res, next) => {

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_SECRET,
        (err, decoded) => {
            if(err){
                return res.status(403).json({
                    message: 'Invalid token'
                })
            }
            req.user = decoded.id;
            req.role = decoded.role;
            next();
        }
    )

  // try {
  //   const token = req.headers.authorization.split(' ')[1];
  //   const decodedToken = jwt.verify(token, process.env.ACCESS_SECRET);
  //   const userId = decodedToken.id;
  //   next();
  // } catch {
  //   res.status(401).json({
  //     error: new Error('Invalid request!')
  //   });
  // }
};

 module.exports = verifyJWT;


 // const authHeader = req.headers.authorization;
 //    if(!authHeader){
 //        return res.status(401).json({
 //            message: 'Unauthorized'
 //        })
 //    }
 //    console.log(authHeader);
 //    const token = authHeader.split(' ')[1];
 //    jwt.verify(
 //        token,
 //        process.env.ACCESS_SECRET,
 //        (err, decoded) => {
 //            if(err){
 //                return res.status(403).json({
 //                    message: 'Invalid token'
 //                })
 //            }
 //            req.user = decoded.id;
 //            next();
 //        }
 //    )