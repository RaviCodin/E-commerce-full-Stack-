const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const path = require('path')
const fileUpLoad = require('express-fileupload')

const errorMiddware = require('./middleWare/error');

//config
if(process.env.NODE_ENV !== "PRODUCTION"){
    dotenv.config({path:"backend/config/config.env"});
}

app.use(express.json())
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpLoad());

// routes import
const product = require("./routes/productsRoutes");
const user = require('./routes/userRoutes');
const order = require('./routes/orderRoute');
const payment = require('./routes/paymentRoutes');

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

app.use(express.static(path.join(__dirname,"../frontend/build/")))

app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"../frontend/build/index.html"))
})

// middleWare For Error
app.use(errorMiddware)


module.exports = app;