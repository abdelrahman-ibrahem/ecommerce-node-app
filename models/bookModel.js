const mongoose = require('mongoose');
const slugify = require('slugify');


const bookSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true , 'please login']
    },
    name: {
        type: String,
        required: [true , 'name of the book is required'],
        minlength: 3,
        maxlength: 30,
    },
    descrption: {
        type: String,
        required: [true , 'descrption of the book is required']
    },
    slug: String,
    image: {
        type: String,
        default: 'default.png'
    },
    price: {
        type: Number,
        required: [true, 'the price of the book is required']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    auther:{
        type: String,
        required: [true , 'the auther is required'],
    },
    avalibale:{
        type: Boolean,
        default: true
    }
});
bookSchema.pre('save', function(next){
    this.slug = slugify(this.name , {lower: true});
    next();
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;