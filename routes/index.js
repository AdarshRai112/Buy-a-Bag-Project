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
    let user = await usermodel.findOne({email: req.user.email});
    user.cart.push({product:req.params.id});
    await user.save();
    req.flash("success","Added to cart successfully");
    res.redirect("/shop");
})
router.get("/removefromcart/:id",isLoggedIn,async(req,res)=>{
    try{
        let user = await usermodel.findOne({email: req.user.email});
        user.cart = user.cart.filter((productid)=>productid._id!=req.params.id);
        await user.save();
        req.flash("success","Added to cart successfully");
        res.redirect("/cart");
    }
    catch(err){
        req.flash("error","Failed to remove from cart");
        res.redirect("/cart");
    }
})
router.get("/increasequantity/:id",isLoggedIn,async(req,res)=>{
    try{
        let user=await usermodel.findOne({email:req.user.email});
        //storing item in const 

        const cartitem=user.cart.find((item)=>item._id.toString()===req.params.id);
        cartitem.quantity++;
        await user.save();
        res.redirect("/cart");}
    catch(err){
        req.flash('error',"failed to increase");
        res.redirect("/cart");
    }
})
router.get("/decreasequantity/:id",isLoggedIn,async(req,res)=>{
    try{
        let user=await usermodel.findOne({email:req.user.email});
        //storing item in const 
        const cartitem=user.cart.find((item)=>item._id.toString()===req.params.id);
        cartitem.quantity>1?cartitem.quantity--:1;
        await user.save();
        res.redirect("/cart");}
    catch(err){
        req.flash('error',"failed to decrease");
        res.redirect("/cart");
    }
})
// router.get("/discountedproduct",isLoggedIn,async (req,res)=>{
//     try{
//         let products=await productModel.find({discount:{$gt:0}});
//         req.flash("success","Discounted Product");
//         res.render("shop",{products:products,success});
        
//     }
//     catch(err){
//         req.flash("error","Failed to fetch discounted products");
//         res.redirect("/shop");
//     }

// })
router.get("/cart",isLoggedIn,async (req,res)=>{
    let user=await usermodel
    .findOne({email:req.user.email})
    .populate("cart.product");
    res.render("cart",{user});
})
router.get("/shop",isLoggedIn,async (req,res)=>{
    let success=req.flash("success");
    const products=await productModel.find();
    res.render("shop",{products,success});
})
router


module.exports=router;