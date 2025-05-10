const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("MOngoDB Terconnect Coy")
    } catch (error) {
        console.log("Gak terconnect MongoDB nya", error);
        process.exit(1);
    }
}

module.exports = connectDB;