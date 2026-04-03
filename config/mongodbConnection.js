const mongoose = require("mongoose");


const dbConnect = ()=>{
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{ 
        console.log("DB Connected Successfully!")
     })
     .catch((error)=>{
        console.log(error);
        console.log("DB Connection Failed.");
     })
}


module.exports = dbConnect;