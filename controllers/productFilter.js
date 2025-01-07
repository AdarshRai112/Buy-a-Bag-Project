const productModel = require('../models/productmodel');
let discountedproducts = async (req,res)=>{
    try{
        let products=await productModel.find();
        let discountedproducts=products.filter((product)=>{return product.discount>0});
        req.flash("success","Discounted Products");
        res.redirect("/shop?discounted=true")
    }
    catch(err){
        req.flash("error","Failed to fetch discounted products");
        res.redirect("/shop");
    }
}
let allproducts = async (req,res)=>{
    try{
        let products=await productModel.find();
        req.flash("success","All Products");
        res.redirect("/shop?discounted=false",{products:products})
    }
    catch(err){
        req.flash("error","Failed to fetch products");
        res.redirect("/shop");
    }

}
module.exports = {discountedproducts,allproducts};