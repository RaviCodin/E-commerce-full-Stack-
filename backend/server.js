const app =require('./app')
const dotenv = require('dotenv');
const cloudinary = require('cloudinary')
const connectDatabase = require('./config/database');
const cors = require("cors")

app.use(cors())

//config
if(process.env.NODE_ENV !== "PRODUCTION"){
    dotenv.config({path:"backend/config/config.env"});
}

//connecting to database
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET

});

// uncaughtException
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting Down the server due to uncaught Exception");
    process.exit(1)
})

// connect database
// connectDatabase();

app.listen(process.env.PORT , ()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
}) 

// unhandled Promise Rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.massage}`);
    console.log("Shutting Down the server due to unhandled Promise Rejection");


    server.close(()=>{
        process.exit(1);
    })
})

// console.log(hello); 