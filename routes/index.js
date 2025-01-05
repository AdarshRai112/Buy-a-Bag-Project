const express = require('express');
const isLoggedIn = require('../middlewares/isLoggedIn');
const router = express.Router();
const productModel = require('../models/productmodel');
const usermodel = require('../models/usermodel');
const nodemailer = require('nodemailer');

router.get("/", (req, res) => {
    let error = req.flash("error");
    let success = req.flash("success");
    res.render("index", { error, success, loggedin: false });
});
router.get("/addtocart/:id", isLoggedIn, async (req, res) => {
    let user = await usermodel.findOne({ email: req.user.email });
    user.cart.push({ product: req.params.id });
    await user.save();
    req.flash("success", "Added to cart successfully");
    res.redirect("/shop");
})
router.get("/removefromcart/:id", isLoggedIn, async (req, res) => {
    try {
        let user = await usermodel.findOne({ email: req.user.email });
        user.cart = user.cart.filter((productid) => productid._id != req.params.id);
        await user.save();
        req.flash("success", "Added to cart successfully");
        res.redirect("/cart");
    }
    catch (err) {
        req.flash("error", "Failed to remove from cart");
        res.redirect("/cart");
    }
})
router.get("/increasequantity/:id", isLoggedIn, async (req, res) => {
    try {
        let user = await usermodel.findOne({ email: req.user.email });
        //storing item in const 

        const cartitem = user.cart.find((item) => item._id.toString() === req.params.id);
        cartitem.quantity++;
        await user.save();
        res.redirect("/cart");
    }
    catch (err) {
        req.flash('error', "failed to increase");
        res.redirect("/cart");
    }
})
router.get("/decreasequantity/:id", isLoggedIn, async (req, res) => {
    try {
        let user = await usermodel.findOne({ email: req.user.email });
        //storing item in const 
        const cartitem = user.cart.find((item) => item._id.toString() === req.params.id);
        cartitem.quantity > 1 ? cartitem.quantity-- : 1;
        await user.save();
        res.redirect("/cart");
    }
    catch (err) {
        req.flash('error', "failed to decrease");
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
router.get("/cart", isLoggedIn, async (req, res) => {
    let user = await usermodel
        .findOne({ email: req.user.email })
        .populate("cart.product");
    res.render("cart", { user });
})
router.get("/shop", isLoggedIn, async (req, res) => {
    let success = req.flash("success");
    const products = await productModel.find();
    res.render("shop", { products, success });
})
router.get("/placeorder", isLoggedIn, async (req, res) => {
    let total = req.query.total;
    let error = req.flash("error");
    res.render("place-order", { total,error});
});
router.post("/placeorder", isLoggedIn, async (req, res) => {
    try {
        let user = await usermodel.findOne({ email: req.user.email });
        let cart = user.cart;
        const { total, address, payment, mobile } = req.body;
        user.orders.push(cart);
        user.cart=[];
        await user.save();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
        });


        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Order Confirmation',
            text: `Your order has been placed successfully!\n\nOrder Details:\nFinal Total: ₹${total}\n\nYour Order will be dilevered to you at ${address}\n\n Thank you for shopping with us!`
        };

        await transporter.sendMail(mailOptions);

        req.flash("success","Ordered placed successfully ! Confirmation email sent");
        res.redirect("/shop");
    }
    catch (err) {
        console.log("Error: "+err);
        req.flash('error', "Failed to Place order");
        res.redirect("/placeorder");
    }



});


module.exports = router;