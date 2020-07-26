const mongoose = require("mongoose")
const config = require("config")
const db = config.get("mongoURI")


const connectDB = async () => {
   try {
    await mongoose.connect(db, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    console.log("mongodb connected!")
   } catch(error) {
       console.log("Connection error! ", error.message);
       process.exit(1);
   }
}

module.exports = connectDB
