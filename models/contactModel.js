const mongoose = require('mongoose');
const Validator = require('validator');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true , 'the name is required'],
        minlength: 3,
        maxlength: 30
    },
    email:{
        type: String,
        required: [true , 'the email is required'],
        validate: [Validator.isEmail , 'please enter valid email'],   
    },
    message: {
        type: String,
        required: [true , 'the message is required'],
    }
});


const Contact = mongoose.model('Contact' , contactSchema);

module.exports = Contact;