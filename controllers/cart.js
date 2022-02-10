const Cart = require('../models/cartModel');


exports.get_all_order =  async (req , res)=>{
    try{
        const orders = await Cart.find().populate('user' , 'username email address').populate('book' , 'name image price');
        res.status(200).json({
            status:"success",
            orders
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};

exports.my_cart = async (req , res)=>{
    try{
        const myOrders = await Cart.find({ user: req.user._id }).populate('user' , 'username email ').populate('book' , 'name image price');
        res.status(200).json({
            status:"success",
            myOrders
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};


exports.create_new_order = async (req , res)=>{
    try{
        const newOrder = await Cart.create({
            user: req.user._id,
            book: req.body.book,
            quantity: req.body.quantity,
        });
        res.status(200).json({
            status:"success",
            newOrder
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};


exports.delete_order_with_id = async (req , res)=>{
    try{
        await Cart.findByIdAndRemove(req.params.id);
        res.status(200).json({
            status:"deleted",
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};


exports.update_quantity =  async (req , res)=>{
    try{
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id , {
            quantity: req.body.quantity
        }, { new: true});
        res.status(200).json({
            status:"the order is updated",
            cart: updatedCart
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};