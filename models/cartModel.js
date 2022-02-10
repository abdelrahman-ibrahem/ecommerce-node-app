const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true , 'please login first']
    },
    book:{
        type: mongoose.Schema.ObjectId,
        ref: 'Book',
        required: [true , 'please login first']
    },
    quantity:{
        type: Number,
        required: [true , 'please enter the quantity'],
        validate:{
            validator: function(v){
                return v > 0;
            },
            message: "please enter the valid quantity"
        }
    }
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;