const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleWare/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
// const { now } = require("mongoose");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { send } = require("process");
const cloudinery = require('cloudinary')

//registation user
exports.registationUser = catchAsyncError(async (req, resp, next) => {

  const myCloud = await cloudinery.v2.uploader.upload( req.body.avatar,{
    folder: "avatars",
    width: 150,
    crop: "scale",
  } );
  
  const { name, email, password  } = req.body;
  // console.log("0k ");
    

    const user = await User.create({
      name,
      email,
      password,
      avtar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });


  sendToken(user, 201, resp);
});

// log-in User
exports.loginUser = catchAsyncError(async (req, resp, next) => {
  const { email, password } = req.body;
  // console.log(req.body.password)

  // checking if user has given email and password both;
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email and password", 401));
  }

  // const isPasswordmatch =  user.comparePasswordx(password);
  const isPasswordmatch = await user.compPass(password);

  if (!isPasswordmatch) {
    return next(new ErrorHandler("Invalid email and password", 401));
  }

  sendToken(user, 200, resp);
});

//loggout User
exports.logout = catchAsyncError(async (req, resp, next) => {
  
  resp.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  // console.log("ok"+Date.now())
  resp.status(200).json({
    sucess: true,
    massage: "logged out",
  });
});

// Forget Password link genrating
exports.forgetPassword = catchAsyncError(async (req, resp, next) => {
const {email} = req.body
  const user = await User.findOne({ email });
  
  // console.log("hii.."+user)
  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  // get ResetPassword Token
  const resetToken = user.getResentPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

  const massage = `Your password reset token is :- \n\n ${resetPasswordUrl} \n`;

  try {
    await sendEmail({
      email: user.email,
      subject: `E-commerce Password Recovery`,
      massage,
    });
    resp.status(200).json({
      sucess: true,
      massage: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    next(new ErrorHandler(error.massage, 500));
  }
});

// reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler("Reset password token is expire or invalid", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler(" password and confirm password not machted", 400)
    );
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// get User Details

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  // console.log("getUserDetails OKEY")

  res.status(200).json({
    sucess: true,
    user,
  });
});

// password update
exports.passwordUpdate = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // const isPasswordmatch =  user.comparePasswordx(password);
  const isPasswordmatch = await user.compPass(req.body.oldPassword);

  if (!isPasswordmatch) {
    return next(new ErrorHandler("Old password is invalid", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("password and confirmPassword does not machted", 400)
    );
  }
  console.log(isPasswordmatch);

  user.password = req.body.newPassword;

  await user.save();
  sendToken(user, 200, res);
});


// profile update
exports.profileUpdate = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name:req.body.name,
    email:req.body.email,
    
  }
  // we will add cloudinery letter
  if(req.body.avatar !== ""){
    const user = await User.findById(req.user.id);

    const imageId = user.avtar.public_id
  
    await cloudinery.v2.uploader.destroy(imageId);
    
    const myCloud = await cloudinery.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    } );
    
      newUserData.avtar ={
        public_id:myCloud.public_id,
        url:myCloud.secure_url,
      }
    }



    const user =  await User.findByIdAndUpdate(req.user.id, newUserData, {
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        
    })
  });

  
  // get all user (access Admin)
  exports.getAllUser = catchAsyncError(async (req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
      sucess:true,
      users
    })
  })

    // get single user (access Admin)
    exports.getsingleUser = catchAsyncError(async (req,res,next)=>{
      const user = await User.findById(req.params.id);
  
      if(!user){
        return next(new ErrorHandler(`User Does not exist with id : ${req.params.id}, 400`))
      }
      res.status(200).json({
        sucess:true,
        user
      })
    })



 // update user role ---admin
 exports.updateUserRole = catchAsyncError(async (req, res, next) => {
   
  const newUserData = {
      name:req.body.name,
      email:req.body.email,
      role:req.body.role
  }
  // we will add cloudinery letter

  const user =  await User.findByIdAndUpdate(req.params.id, newUserData, {
      new:true,
      runValidators:true,
      useFindAndModify:false
  })
  res.status(200).json({
      success:true,
      user
  })
});


    // delete user  ---admin
    exports.deleteUser = catchAsyncError(async (req, res, next) => {
   
        const user = await User.findById(req.params.id);

        //  remove image from cloudinery 
        const imageId = user.avtar.public_id
  
        await cloudinery.v2.uploader.destroy(imageId);

        if(!user){
          return next(new ErrorHandler(`User Does not exist with id : ${req.params.id}, 400`))
        }
    
        await user.remove();
      res.status(200).json({
          success:true,
         massage:"delete succsessfull"
      })
    });
    