const userModel= require("../models/user-model");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const { generateToken }= require("../utils/generateToken");

module.exports.registerUser= async function(req,res){
    try{
        let {email,fullname,password} =req.body;

        let user= await userModel.findOne({email:email});
        if(user) {
            req.flash("error","You already have an account,Please login");
            return res.redirect("/");
        }
        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(password,salt, async function(err,hash){
                if(err) return res.send(err.message);
                else{
                    let user= await userModel.create({
                        email,
                        password:hash,
                        fullname
                    });
                    let token=generateToken(user);
                    res.cookie("token",token);
                    req.flash("success","Account created Successfully");
                    return res.redirect("/shop");
                }
            });
        })

        
    }catch(err){
        res.send(err.message);
    }
};

module.exports.loginUser= async function(req,res){
    let {email, password} =req.body;
    let found=await userModel.findOne({email:email});
    if(!found) {
        req.flash("error","Email or Password incorrect");
        return res.redirect("/");
    }
    else{
        bcrypt.compare(password,found.password, function(err,result){
            if(result==true){
                let token=generateToken(found);
                res.cookie("token",token);
                res.redirect("/shop");
            }
            else {
                req.flash("error","Email or Password incorrect");
                return res.redirect("/");
            }
        }); 
    }
    
};

module.exports.logout=async function(req,res){
    res.cookie("token","");
    res.redirect("/");
};