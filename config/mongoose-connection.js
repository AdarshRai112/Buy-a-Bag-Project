const mongoose=require('mongoose');
const config=require('config');

const dbgr=require('debug')("development:mongoose");
//mongodb://127.0.0.1:27017/BagshopDatabase iska matlab hai ham local server ke mongo db se connect hai
//But future mai jab ham host karenge to hame real database se connect hona hoga isliye ye connection sirf development phase 
//mai rahega

//config .get apne aap hi dekhta hai aapke process ka enviroment kya chal raha hai
//agar development chal raha hai to development sw uthaye ga agar production chal raha hai to production se uthayega

mongoose
.connect(`${config.get("MONGODB_URI")}/BagshopDatabase`)
.then(()=>{
    dbgr("Connected to db");
}).catch((err)=>{
    dbgr(err);
})

module.exports = mongoose.connection