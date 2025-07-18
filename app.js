const express= require('express');
const app= express();
const db=require("./config/mongoose-connection");
const cookieParser=require('cookie-parser');
const path=require('path');
const ownersRouter=require('./routes/ownersRouter');
const usersRouter=require('./routes/usersRouter');
const productsRouter=require('./routes/productsRouter');
const mainRouter=require('./routes/index');
const flash= require("connect-flash");
const expressSession =require("express-session");

require("dotenv").config();
app.use(
    expressSession({
        resave:false,
        saveUninitialized:false,
        secret: process.env.EXPRESS_SESSION_SECRET,
    })
);
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine","ejs");

app.use("/owners",ownersRouter);
app.use("/users",usersRouter);
app.use("/products",productsRouter);
app.use("/",mainRouter);

app.listen(3000);