const Book = require('../models/bookModel');
const multer = require('multer');

// handel upload book image
const storage = multer.diskStorage({
    destination: (req , file , cb)=>{
        cb(null , 'public/img/books');
    },
    filename: (req , file , cb)=>{
        const ext = file.mimetype.split('/')[1];
        cb(null , `book-${Date.now()}.${ext}`);
    }
});

const upload  = multer({storage});

exports.upload_book_image = upload.single('image');

exports.get_all_books = async (req , res)=>{
    try{
        const books = await Book.find();
        res.status(200).json({
            status: "success",
            books:{
                books
            }
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};

exports.get_book_with_slug =  async (req , res)=>{
    try{
        const book = await Book.findOne({slug: req.params.slug});
        res.status(200).json({
            status: "success",
            book:{
                book
            }
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};

exports.create_new_book = async (req , res)=>{
    try{
        // image not here now
        const book = await Book.create({
            user: req.user._id,
            name: req.body.name,
            descrption: req.body.descrption,
            price: req.body.price,
            auther: req.body.auther,
            image: req.file.filename
        });
        res.status(200).json({
            status: "the new book is created",
            book :{
                book
            }
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};

exports.update_book_with_slug =  async (req , res)=>{
    try{
        const book = await Book.findOne({slug: req.params.slug});
        if (!book){
            return res.status(400).json({
                status: "failed",
                message:"this book is not found" 
            });
        }
        const updatedBook = await Book.findByIdAndUpdate(book._id , req.body, {new: true});
        res.status(200).json({
            status: "the book is updated",
            book :{
                updatedBook
            }
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};


exports.delete_book_with_id =  async (req , res)=>{
    try{
        const book = await Book.findById(req.params.id);
        if (!book){
            return res.status(400).json({
                status: "failed",
                message:"this book is not found" 
            });
        }
        await Book.findByIdAndRemove(req.params.id);
        res.status(200).json({
            status: "deleted",
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};