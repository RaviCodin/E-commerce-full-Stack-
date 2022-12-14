const mongoose = require("mongoose");

const productSchma = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Plese enter product name"],
        trim:true
    },

    description:{
        type:String,
        required:[true,"Plese enter product description"]
    },
    price:{
        type:Number,
        required:[true,"Plese enter product Price"],
        maxlength:[8,"Price Can not exceed 8 charecters"]
    },
    ratings: {
        type:Number,
        default:0
    },
    Images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],

    category:{
        type:String,
        required:[true,"Please enter product Catagery"]
    },
    stock:{
        type:Number,
        required:[true,"Please enter product Stock"],
        maxlength:[4,"Stock Cannot Exceed 4 charecter"],
        default:1
    },
    numOfReviews :{
        type:Number,
        default:0
    },

    reviews:[
        {
        user:{
            type: mongoose.Schema.ObjectId,
            ref:"User",
            required:true
        },
        name:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true

        },
        comments:{
            type:String
        }
    }
],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        // required:true
    },
    createDate:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("product",productSchma);