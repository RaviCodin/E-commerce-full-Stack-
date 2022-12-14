const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,"Please Enter Your Name"],
        maxlength:[30,"Name can not Exceed more the 30 charecter"],
        minlength:[4,"please more than 4 charecter"]
    },

    email:{
        type:String,
        required:[true,"Please Enter Your Email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter valid Email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter Your Password"],
        minlength:[8,"Password Lenth Min 8 Charecter"],
        select:false
    },
    avtar:{
        public_id:{
            type:String,
            // required:[true,"Please Enter Your id"]
        },
        url:{
            type:String,
            // required:[true,"Please Enter Your url"]
        }
    },

    role:{
        type:String,
        default:"user"
    },

    createAt:{
        type:Date,
        default:Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});


userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
})

//JWT Token
userSchema.methods.getJWTToken = function(){
    // console.log(process.env.JWTSECRET+" "+process.env.JWTEXPIRE)
    return jwt.sign({ id:this._id }, process.env.JWTSECRET,{ expiresIn: process.env.JWTEXPIRE })
}


// compare password
userSchema.methods.compPass = async function(enteredPassword){
    return  await bcrypt.compare(enteredPassword,this.password);
}

// genrating reset password token
userSchema.methods.getResentPasswordToken = function(){
    // generating token 
    const resetToken = crypto.randomBytes(20).toString("hex");
    
    // Hashing and adding reset token to userSchma
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 45 * 60 * 1000;
    
    // console.log("ok")
    return resetToken;
}


module.exports = mongoose.model('users', userSchema)