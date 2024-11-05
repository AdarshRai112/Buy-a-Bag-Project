const mongoose=require('mongoose');
//mongodb://127.0.0.1:27017/BagshopDatabase iska matlab hai ham local server ke mongo db se connect hai
//But future mai jab ham host karenge to hame real database se connect hona hoga isliye ye connection sirf development phase 
//mai rahega

mongoose.connect("mongodb://127.0.0.1:27017/BagshopDatabase")
.then(()=>{
    console.log("Connected to db");
}).catch((err)=>{
    console.log(err);
})

module.exports = mongoose.connection