const express = require('express');
const router = express.Router();
const Contact = require('../models/contactModel');
const { protect} = require('../controllers/user');
// for admin user
// get all the message 
router.get('/' , async (req , res)=>{
    try{
        const messages = await Contact.find();
        res.status(200).json({
            status: "success",
            contacts: {messages}
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
});

// for send the message to the company 

router.post('/', async (req , res)=>{
    try{
        const message = await Contact.create({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        });
        res.status(200).json({
            status: "success",
            message
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
});


// for delete message after send response 

router.delete('/delete/:id' , protect , async (req , res)=>{
    try{
        const message = await Contact.findById(req.params.id);
        if (!message){
            return res.status(400).json({
                status: "failed",
                message: "no message"
            });
        }
        await Contact.findByIdAndRemove(req.params.id);
        res.status(200).json({
            status: "sucess",
            message: "deleted"
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
})

module.exports = router;