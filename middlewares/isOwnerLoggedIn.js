const jwt=require('jsonwebtoken');
const ownerModel=require("../models/ownermodel");

module.exports =async (req,res,next)=>{
    if(!req.cookies.token){
        req.flash("You need to login first");
        return res.redirect("/");
    }
    try{
        let decoded=jwt.verify(req.cookies.token,process.env.JWT_KEY);
        let owner= await ownerModel
           .findOne({email:decoded.email})
           .select("-password");
        
        req.owner=owner;
        next();
    }
    catch(err){
        req.flash("error", "something went wrong");
        res.redirect("/onwerlogin");
    }
};

