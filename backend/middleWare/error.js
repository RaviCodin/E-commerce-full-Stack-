const ErrorHandler = require('../utils/errorHandler')

module.exports = (err,req,resp,next )=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server Error LOL";
    // console.log(err.masssage)

    //wrong mongodb id error
    if(err.name === "CastError"){
        const mas = `Resource not found ${err.path}`;
        err = new ErrorHandler(mas,400);
    }

    if(err.code === 11000){
        const mas = `Dupicate  ${Object.keys(err.keyValue)} Entered`;
        // console.log(massage)
        err = new ErrorHandler(mas,400);
    }

        //wrong JWT Error
        if(err.name === "JsonWebTokenError"){
            const mas = `JsonWebTokenError is invalid , try again`;
            err = new ErrorHandler(mas,400);
        }

          //wrong JWT expire
          if(err.name === "TokenExpiredError"){
            const mas = `JsonWebTokenError is Expired , try again`;
            err = new ErrorHandler(mas,400);
        }

    resp.status(err.statusCode).json({
       success:false,
    //    error: err.statusCode,
       massage:err.masssage
        })

}