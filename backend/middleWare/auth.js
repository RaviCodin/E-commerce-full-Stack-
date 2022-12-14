const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('./catchAsyncError')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')


exports.isAuthanticatedUser = catchAsyncError( async (req, resp, next) => {
    const{ token } = req.cookies;

    if(!token){
        next(new ErrorHandler("Please Login to Access this resourse",401));
    }

    const decodedData = jwt.verify(token, process.env.JWTSECRET);

    req.user = await User.findById(decodedData.id);

    // console.log("isAuthanticatedUser ok "+ req.user)

    next();
    // console.log(token)
})

exports.authourizRoles = (...roles) => {
    return (req,resp,next)=>{
        // console.log("ok : "+req.user)
        if(!roles.includes(req.user.role)){
            return next(
                new ErrorHandler(`Role : ${req.user.role} is not allowed to access the resource`,403)
            )
        }

        next()
    }
}