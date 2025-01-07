const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const router = express.Router();
const productModel = require('../models/productmodel');
const usermodel = require('../models/usermodel');
const {addtocart,removefromcart,increasequantity,decreasequantity}=require('../controllers/updatecart');
const { discountedproducts ,allproducts} = require('../controllers/productFilter');
const{placeorder}=require('../controllers/orderController');

router.get("/", (req, res) => {
    let error = req.flash("error");
    let success = req.flash("success");
    res.render("index", { error, success, loggedin: false });
});
router.get("/addtocart/:id",isLoggedIn,addtocart);

router.get("/removefromcart/:id", isLoggedIn,removefromcart);

router.get("/increasequantity/:id", isLoggedIn,increasequantity);

router.get("/decreasequantity/:id", isLoggedIn,decreasequantity);

router.get("/discountedproducts",isLoggedIn,discountedproducts);

router.get("/allproducts",isLoggedIn,allproducts);
router.get("/cart", isLoggedIn, async (req, res) => {
    let user = await usermodel
        .findOne({ email: req.user.email })
        .populate("cart.product");
    res.render("cart", { user });
})
router.get("/shop", isLoggedIn, async (req, res) => {
    let success = req.flash("success");
    let products = await productModel.find();
    // console.log(req.query);
    if(req.query.discounted==="true"){
        // console.log("pass ho gaya hai");
        products=products.filter((product)=>{
    return product.discount>0 });
    }
    res.render("shop", { products, success });
})
router.get("/ownerlogin", async (req, res) => {
    let error = req.flash("error");
    res.render("owner-login",{error});
})
router.get("/placeorder", isLoggedIn, async (req, res) => {
    let total = req.query.total;
    let error = req.flash("error");
    res.render("place-order", { total,error});
});
router.post("/placeorder", isLoggedIn,placeorder);


module.exports = router;