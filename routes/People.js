const express=require('express');
const People=require('../models/People');
const router=express.Router();
const jwt=require('jsonwebtoken');
const {isAuthenticated}=require('../authorization/Auth')

router.post('/add',isAuthenticated,async(req,res)=>{
    const{email}=req.body;
    console.log("request paucha in People route",req.body)
    try {
        const newPerson=new People({email});
        await newPerson.save();
        res.status(201).json({message:"Email added successfully",person:newPerson});
    } catch (error) {
        if (error.code === 11000) { 
            return res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Server error', error });
    }
});
router.get('/emails',isAuthenticated,async(req,res)=>{
    console.log("entered in fetching emails from peoples")
    try {
        const people = await People.find({}, 'email'); 
        const emails = people.map(person => person.email);
        res.json({emails});
    } catch (error) {
        res.status(500).json({ message: 'Error fetching emails',error });
    }
})
module.exports=router;
