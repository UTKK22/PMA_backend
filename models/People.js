const mongoose=require('mongoose')
const PeopleSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
})
module.exports=mongoose.model('People',PeopleSchema)