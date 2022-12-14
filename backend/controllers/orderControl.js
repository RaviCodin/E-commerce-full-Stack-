const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleWare/catchAsyncError");

exports.newOrder = catchAsyncError(async (req, resp, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    users,
  } = req.body;
  
  console.log(users)
  
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    users,
    paidAt: Date.now(),
    creatAt: Date.now(),
    user:req.user._id
});


resp.status(201).json({
    success: true,
    order,
});

});



// get single order
exports.getSingleOrder = catchAsyncError(async (req, res, next)=>{
  // console.log("okey...",req.params.id)
  const order = await Order.findById(req.params.id)

  if(!order){
    next(new ErrorHandler("Order not found with this id", 404));
  }

  res.status(200).json({
    success:true,
    order
  });
});


// get logged in user orders
exports.myOrders = catchAsyncError(async (req, res, next)=>{
  const orders = await Order.find({ user: req.user._id })

  res.status(200).json({
    success:true,
    orders
  })
});

// get all orders -- admin
exports.getAllOrders = catchAsyncError(async (req, res, next)=>{
  const orders = await Order.find()

  let totalAmount = 0;
  orders.forEach((order)=>{
    totalAmount+=order.totalPrice;
  })
  res.status(200).json({
    success:true,
    totalAmount,
    orders
  })
});

// update orders Status-- admin
exports.updateOrder = catchAsyncError(async (req, res, next)=>{
  const order = await Order.findById(req.params.id)
  
  if(!order){
    next(new ErrorHandler("Order not found with this id", 404));
  }
  
  if(order.orderStatus==="Delivered"){
    return next(new ErrorHandler("You have already Delivered this order ",404))
  }
  
 if(req.body.status === "Shipped"){
  order.orderItems.forEach(async (order)=>{
    await updateStock(order.product, order.quantity)
  });
 }
 

  order.orderStatus = req.body.status;

  if(req.body.status === "Delivered"){
    order.deliveredAt = Date.now();
  }
  
  await order.save({ validateBeforeSave:false })
  console.log("ok...UpdateOrder")
  res.status(200).json({
    success:true,
    // totalAmount,
    order
  })
});

async function updateStock(id, quantity){
  const product = await Product.findById(id);

  product.stock -= quantity;

  await product.save({ validateBeforeSave:false })
}



// delete order -- admin
exports.deleteOrder = catchAsyncError(async (req, res, next)=>{

  const order = await Order.findById(req.params.id)
  // console.log("order deleted")

  if(!order){
    next(new ErrorHandler("Order not found with this id", 404));
  }
  await order.remove();

  res.status(200).json({
    success:true,
   
  })
});