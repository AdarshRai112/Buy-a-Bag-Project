const userModel=require('../models/usermodel');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const {generateToken} = require("../utils/generateToken");
let registerUser = async (req,res)=>{
    try{
        let {fullname,email,password}=req.body;
        let user=await userModel.findOne({email});
        if(user)
            return res.status(400).send("This user already exist");
    
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt,async (err,hash)=>{
                if(err) return res.send(err.message);
                else{
                    let createdUser= await userModel.create({
                        fullname,
                        password:hash,
                        email,
                    });
                    
                    let token = generateToken(createdUser);
                    res.cookie("token",token);
                    res.send("user created succesfully");
                }
            })
        })
    }
    catch(err){
        res.send(err.message);
    }
}
let loginUser= async(req,res)=>{
    try{
        let {email,password}=req.body;
        let user=await userModel.findOne({email});
        if(!user){
            req.flash("error","Email or passowrd Incorrect");
            return res.redirect("/");
        }
        bcrypt.compare(password,user.password,(err,result)=>{
            if(!result) {
                req.flash("error","email or password Incorrect");
                return res.redirect("/");  
            } 
            else{
                let token=generateToken(user);
                res.cookie("token",token);
                res.redirect("/shop");
            }
        });


    }
    catch(err){
        res.send(err.message);
    }
}
let logoutUser= async(req,res)=>{
        try{
            req.flash("success","Logout Successfully");
           req.session.destroy(()=>{
            res.clearCookie('token');
            return res.redirect("/");
        })
}
catch(err){
    req.flash("success","");
    req.flash("error","Logout Failed")
}
}
module.exports={registerUser,loginUser,logoutUser};