const mongoose = require('mongoose');
const Validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true , 'username is required'],
        minlength: 3,
        maxlength:25,
        unique: true
    },
    email:{
        type: String,
        required: [true , 'email is required'],
        unique: true,
        validate: [Validator.isEmail , 'please enter valid email'],
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: [true , 'password is required'],
    },
    passwordConfirm: {
        type: String,
        required: [true , 'password confirm is required'],
        validate:{
            validator: function(v){
                return this.password === v;
            },
            message: "password confirm must be the same password"
        }
    },
    photo: {
        type: String,
        default: 'default.png'
    },
    address: {
        type: String,
        required: [true , 'the address is required']
    }
});

userSchema.pre('save', async function(next){
    if (!this.isModified )return next();
    this.password = await bcrypt.hash(this.password , 10);
    this.passwordConfirm = undefined;
    next();
});

const User = mongoose.model('User' , userSchema);
module.exports = User;