const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../models/productmodel');

router.get("/", (req, res) => {
    res.send("Hey Its working");
});

router.post("/create", upload.single("image"), async (req, res) => {
    try{
        let { name,price, discount, bgcolor, panelcolor, textcolor} = req.body;

    let product = await productModel.create({
        image: req.file.buffer,
        name,
        price,
        discount,
        bg_color: bgcolor,
        panelcolor,
        textcolor
    })
    req.flash("success","Product created successfully");
    res.redirect('/owners/admin');
    }
    catch(err){
        res.send(err.message);
    }
})

module.exports = router;