const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require('../middleWare/catchAsyncError');
const Apifeature = require("../utils/apifeatures");
const cloudinary = require("cloudinary");



// create product --Admin
exports.createProduct = catchAsyncError( async (req,resp,next)=>{
    let Images = [];

    if(typeof req.body.Images === "string"){
        Images.push(req.body.Images);
    }else{
        Images = req.body.Images
    }

    const imagesLink = [];

    for (let i = 0; i < Images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(Images[i],{
            folder:"products"
        })

        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url
        })
        
    }


    req.body.user = req.user.id;
    req.body.Images = imagesLink;
    
    const product = await Product.create(req.body)
    
    resp.status(201).json({
        success:true,
        product
    })
});

//get all products
exports.getAllProducts = catchAsyncError( async (req,resp,next)=>{
    // return next(new ErrorHandler("This Error handler by me",500));
    const resultPerPage =10;
    const productCount = await Product.countDocuments();

    const apifeature = new Apifeature(Product.find(), req.query )
    .search()
    .filter()
   
    let products = await apifeature.query
    
    // console.log("products:", products)

    let filterProductCount = products.length;
    
    apifeature.pagination(resultPerPage);
    
    products = await apifeature.query;

resp.status(200).json({
    success:true,
    products,
    productCount,
    resultPerPage,
    filterProductCount,

})
});

//get all products (ADMIN)
exports.getAdminProducts = catchAsyncError( async (req,resp,next)=>{

    const products = await Product.find();
    
resp.status(200).json({
    success:true,
    products,
  

})
});


//get product details
exports.getProductDetails =catchAsyncError( async (req,resp,next)=>{
        const product = await Product.findById(req.params.id);

      if(!product){
          massage = "Product not found";
       return next(new ErrorHandler(massage,404));
    }

    resp.status(200).json({
        success:true,
        product
    })
       
});

//update Product
exports.updateProduct = catchAsyncError( async (req,resp , next)=>{
    let product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("Product not found",404));
     }

    //  images start here
    let Images = [];

    if(typeof req.body.Images === "string"){
        Images.push(req.body.Images);
    }else{
        Images = req.body.Images
    }

    if(Images !== undefined){
        //  delete images from cloudinary
        for (let i = 0; i < product.Images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.Images[i].public_id)
         }


         const imagesLink = [];

         for (let i = 0; i < Images.length; i++) {
             const result = await cloudinary.v2.uploader.upload(Images[i],{
                 folder:"products"
             })
     
             imagesLink.push({
                 public_id: result.public_id,
                 url: result.secure_url
             })
             
         }

         req.body.Images = imagesLink;
    }



    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    resp.status(200).json({
        success:true,
        product
    })


});


// delete product
exports.deleteProduct = catchAsyncError( async (req,resp,next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("Product not found",404));
     }

    //  delete images from cloudinary
    for (let i = 0; i < product.Images.length; i++) {
         await cloudinary.v2.uploader.destroy(product.Images[i].public_id)
    }


    await product.remove();

    resp.status(200).json({
        success:true,
        message:"Product delete Succssefully"
    })
}); 

// create review and update review

exports.createProductReview = catchAsyncError(async (req, resp, next)=>{
    const {productId,comments,rating} = req.body;
    
    const review = {
        user:req.user._id,
        name:req.user.name,
        rating: Number(rating),
        comments
    }
    
    const product = await Product.findById(productId);
    
    const isReviewed = product.reviews.find(
        rev=> rev.user.toString() === req.user._id.toString()
        );
        
        if(isReviewed){
            product.reviews.forEach((rev)=>{
                if(rev.user.toString() === req.user._id.toString())
                (rev.rating = rating) , (rev.comments = comments);
            })
            
        }
        else{
            product.reviews.push(review)
            product.numOfReviews = product.reviews.length
        }
        let avg=0;
        product.reviews.forEach(rev => {
            avg = avg + rev.rating;
        })
        product.ratings = avg/product.reviews.length ;
        
        // console.log("okey... : Review ")
        
    await product.save({validateBeforeSave: false})
    resp.status(200).json({
        success:true,
    })
})

// get all reviews of a product


exports.getProductReviews = catchAsyncError(async (req, resp, next)=>{

 
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHander("Product not found",404));

    }

    await product.save({validateBeforeSave: false})
    resp.status(200).json({
        success:true,
        reviews: product.reviews
    })
})


// delete review
exports.deleteProductReviews = catchAsyncError(async (req, resp, next)=>{

    const product = await Product.findById(req.query.productId);
    if(!product){
        return next(new ErrorHander("Product not found",404));
    }

    const reviews = product.reviews.filter(
        rev=>rev._id.toString() !== req.query.id.toString()
        );
        console.log("okey..")

    let avg=0;
    reviews.forEach(rev => {
        avg = avg + rev.rating;
    })
    const ratings = avg/product.reviews.length ;
   const numOfReviews = reviews.length;


   await Product.findByIdAndUpdate(req.query.productId , {reviews,ratings,numOfReviews }, {new:true,runValidators:true,useFindAndModify:false}) 
    
  
    resp.status(200).json({
        success:true,
    })
})
