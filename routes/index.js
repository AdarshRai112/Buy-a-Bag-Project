const express=require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const router =express.Router();
const productModel=require('../models/productmodel');

router.get("/",(req,res)=>{
    let error =req.flash("error");
    res.render("index",{error});
});
router.get("/shop",isLoggedIn,async (req,res)=>{
    const products=await productModel.find();
    res.render("shop",{products});
})

module.exports=router;