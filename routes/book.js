const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book');
const {protect} = require('../controllers/user');


// get all the books
router.get('/' ,bookController.get_all_books );
// get singel book with slug
router.get('/:slug' ,bookController.get_book_with_slug);
// create new book 
router.post('/' ,protect  , bookController.upload_book_image, bookController.create_new_book);
// update the book with the slug
router.patch('/:slug' , protect, bookController.update_book_with_slug);
// delete book with id
router.delete('/:id' , protect, bookController.delete_book_with_id);

module.exports = router;