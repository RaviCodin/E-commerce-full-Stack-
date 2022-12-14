 const mongoose = require('mongoose');

 const orderSchema = new mongoose.Schema({
    shippingInfo : {
        address:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true,
            default:"india"
        },
        phoneNo:{
            type:String,
            required:true
        },
        pincode:{
            type:String,
            required:true
        },
       
    },

    orderItems:[{
      
        name:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        stock:{
            type:Number,
        },
        product:{
            type:String,
            ref:"Product",
            required:true
        },
    }],


    paymentInfo:{
        id:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true
        },
    },

    
    itemPrice:{
        type:Number,
        default:0,
        required:true
    },
    taxPrice:{
        type:Number,
        default:0,
        required:true
    },
    shippingPrice:{
        type:Number,
        default:0,
        required:true
    },
    totalPrice:{
        type:Number,
        default:0,
        required:true
    },
    orderStatus:{
        type:String,
        default:"Processing",
        required:true
    },
    paidAt:{
        type:Date,
        required:true
    },
  
    creatAt:{
        type:Date,
        required:true
    },
    users:{
        _id:{
            type:String,
            required:true,
        },

        name:{
            type:String,
            required:true
        },
        email: {
            type:String,
            required:true
        }
    },
    // deliveredAt:Date,
 });

 module.exports = mongoose.model("Order",orderSchema);

