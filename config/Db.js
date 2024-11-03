const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config()
const estconnection=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Successfully connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1); // Terminate the process on failure
    }
}
module.exports=estconnection