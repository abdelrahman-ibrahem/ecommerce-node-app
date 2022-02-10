const express = require('express');
const router = express.Router();
const { protect } = require('../controllers/user');
const cartController = require('../controllers/cart');
// belonging the admin 
// get all the order
router.get('/', cartController.get_all_order);

// get all orders 
router.get('/my-cart', protect , cartController.my_cart);

// for create new order
router.post('/' , protect, cartController.create_new_order);

// for delete my order with id 
router.delete('/delete-cart/:id' ,  protect , cartController.delete_order_with_id);

// for update the quantity of the order
router.patch('/update-cart/:id' ,cartController.update_quantity);

module.exports = router;