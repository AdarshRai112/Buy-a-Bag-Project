const express =require('express');
const router = express.Router();
const ownerModel=require('../models/ownermodel');
const productModel=require('../models/productmodel');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { generateToken } = require("../utils/generateToken");
const isOwnerLoggedIn = require('../middlewares/isOwnerLoggedIn');
const {loginOwner}= require("../controllers/authController");
const productmodel = require('../models/productmodel');
//Ye route tabhi chalega jab development phase hoga
if(process.env.NODE_ENV==="development"){
 router.post("/create", async (req,res)=>{
    let owners=await ownerModel.find();
    if(owners.length>0){
        return res
        .status(401)
        .send("You don't have permission to create new Owner");
    }
    let {fullname,email,password}=req.body;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) return res.send(err.message);
            else {
                let createdOwner = await ownerModel.create({
                    fullname,
                    password: hash,
                    email,
                });

                let token = generateToken(createdOwner);
                res.cookie("token", token);
                res.send(createdOwner);
            }
        })
    })
 });   
}
router.post("/login",loginOwner);
router.get("/admin",isOwnerLoggedIn,async (req,res)=>{
    let success=req.flash('success');
    let products=await productmodel.find();
    res.render("admin",{success,products});
});
router.get("/createproducts",isOwnerLoggedIn,(req,res)=>{
    let error=req.flash("error");
    let success=req.flash("success");
    res.render("createproducts",{error,success});
})



module.exports = router;