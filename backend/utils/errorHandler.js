
class ErrorHandler extends Error {
 constructor(masssage,statusCode){
     super(masssage);
     this.statusCode = statusCode;
    this.masssage = masssage; 

     Error.captureStackTrace(this,this.constructor);
    }
}

module.exports = ErrorHandler;