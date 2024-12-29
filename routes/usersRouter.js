const express =require('express');
const router = express.Router();
const {registerUser,loginUser }=require("../controllers/authController");
require("dotenv").config();

router.get("/",(req,res)=>{
    res.send("Hey Its working");
});
router.post("/register",registerUser);

router.post("/login",loginUser);

module.exports = router;