const express=require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const router =express.Router();
const productModel=require('../models/productmodel');
const usermodel = require('../models/usermodel');

router.get("/",(req,res)=>{
    let error =req.flash("error");
    let success=req.flash("success");
    res.render("index",{error,success,loggedin:false});
});
router.get("/addtocart/:id",isLoggedIn,async (req,res)=>{
    let user = await usermodel.findOne({user: req.user.email});
    
})
router.get("/shop",isLoggedIn,async (req,res)=>{
    const products=await productModel.find();
    res.render("shop",{products});
})


module.exports=router;