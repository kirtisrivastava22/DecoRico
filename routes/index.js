const express=require("express");
const router =express.Router();
const isLoggedIn= require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");
const mongoose = require("mongoose");  

router.get("/",function(req,res){
    let error=req.flash("error");
    res.render("index",{ error ,loggedin: false});
});
router.get("/myaccount", isLoggedIn, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/shop");
        }

        res.render("myaccount", { user });
    } catch (error) {
        console.error("Error fetching user data:", error);
        req.flash("error", "Something went wrong");
        res.redirect("/shop");
    }
});

router.get("/shop",isLoggedIn,async function(req,res){
    let products= await productModel.find();
    let success=req.flash("success");
    res.render("shop",{ products ,success});
});

router.get("/addtocart/:pid", isLoggedIn, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email });

    if (!user) {
        req.flash("error", "User not found");
        return res.redirect("/shop");
    }

    try {
        let existingItem = user.cart.find(item => item.product.toString() === req.params.pid);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cart.push({ product: req.params.pid, quantity: 1 });
        }

        await user.save();
        req.flash("success", "Product added to cart");
    } catch (error) {
        console.error("Error adding product to cart:", error);
        req.flash("error", "Could not add product to cart");
    }

    res.redirect("/shop");
});
;
router.get("/cart", isLoggedIn, async function (req, res) {
    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("cart.product");

    let bill = 0;
    user.cart.forEach(item => {
        const total = (Number(item.product.price) - Number(item.product.discount)) * item.quantity +20 ;
        bill += total;
    });

    res.render("cart", { user, bill });
});
router.get("/cart/increase/:pid", isLoggedIn, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email });

    let item = user.cart.find(item => item.product.toString() === req.params.pid);
    if (item) {
        item.quantity += 1;
        await user.save();
    }
    res.redirect("/cart");
});

router.get("/cart/decrease/:pid", isLoggedIn, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email });

    let item = user.cart.find(item => item.product.toString() === req.params.pid);
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            user.cart = user.cart.filter(i => i.product.toString() !== req.params.pid);
        }
        await user.save();
    }
    res.redirect("/cart");
});

module.exports=router;