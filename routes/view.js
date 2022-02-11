const express = require('express');
const router = express.Router();
const { protect_view , upload_image_profile, protect } = require('../controllers/user');
const Book = require('../models/bookModel');
const { upload_book_image } = require('../controllers/book');
const Cart = require('../models/cartModel');
const Contact = require('../models/contactModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/*
handel update profile function and change password
add payment with stripe 
*/

// for display home page
router.get('/', protect_view , async (req , res)=>{
    const books = await Book.find();
    res.status(200).render('index', {
        title: 'home',
        books,
        user: req.user
    });
});

// for display book page with slug
router.get('/book-detail/:slug' , protect_view , async (req , res)=>{
    const book = await Book.findOne({slug: req.params.slug});
    res.status(200).render('book' , {
        title: `${book.name} page`,
        user: req.user,
        book
    });
});

// for display contact page
router.get('/contact' ,protect_view ,  (req , res)=>{
    res.status(200).render('contact', {
        title: 'contact',
        user: req.user
    });
});


router.post('/create-message' , async (req , res)=>{
    await Contact.create({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    }).then(result=>{
        res.status(200).redirect('/contact');
    }).catch(err=>{
        //console.log(err.message);
        res.status(400).redirect('/contact');
    })
});


// for cart page 
router.get('/my-cart', protect_view , async (req , res)=>{
    const myOrders = await Cart.find({user: req.user._id}).populate('book' , 'name image price');
    let total = 0;
    for( let i=0;i< myOrders.length ;i++){
        total+= (myOrders[i].book.price * myOrders[i].quantity);
    }
    res.status(200).render('cart' , {
        user: req.user,
        title: "my cart",
        orders: myOrders,
        total: total,
    });
});

// for delete order from my cart 
router.get('/my-cart/delete/:orderId', protect_view , async (req , res)=>{
    await Cart.findByIdAndRemove(req.params.orderId).then(()=>{
        res.status(200).redirect('/my-cart');
    }).catch(err=>{
        //console.log(err.message);
        res.status(400).redirect('/my-cart');
    });
});

// for update quantity
router.post('/my-cart/update/:orderId' , protect_view , async (req , res)=>{
    await Cart.findByIdAndUpdate(req.params.orderId , {
        quantity: req.body.quantity
    }, {new: true}).then(result=>{
        res.status(200).redirect('/my-cart');
    }).catch(err=>{
        //console.log(err.message);
        res.status(400).redirect('/my-cart');
    });
});


// for orders page 
router.get('/orders', protect_view , async (req , res)=>{
    const allOrder = await Cart.find().populate('user' , 'username email address').populate('book' , 'name image price');
    res.status(200).render('orders' , {
        user: req.user,
        title: "orders",
        orders: allOrder
    });
});

router.get('/orders/delete/:orderId' , protect_view , async (req , res)=>{
    await Cart.findByIdAndRemove(req.params.orderId).then(()=>{
        res.status(200).redirect('/orders');
    }).catch(err=>{
        //console.log(err.message);
        res.status(400).redirect('/orders');
    });
});

// for messages page 
router.get('/messages', protect_view , async (req , res)=>{
    const messages = await Contact.find();
    res.status(200).render('messages' , {
        user: req.user,
        title: "mesasges",
        messages:messages
    });
});

router.get('/messages/:id', protect_view , async (req , res)=>{
    await Contact.findByIdAndRemove(req.params.id).then(()=>{
        res.status(200).redirect('/messages');
    }).catch(err=>{
        //console.log(err.message);
        res.status(400).redirect('/messages');
    });
});



// for display about page
router.get('/about' ,protect_view ,  (req , res)=>{
    res.status(200).render('about', {
        title: 'about',
        user: req.user
    });
});
// for display profile page
router.get('/profile' ,protect_view ,  (req , res)=>{
    res.status(200).render('profile', {
        title: 'profile',
        user: req.user
    });
});

// for update profile
router.post('/profile/update/:userId', protect_view , upload_image_profile , async (req , res)=>{
    await User.findByIdAndUpdate(req.params.userId , {
        username: req.body.username,
        email: req.body.email,
        photo: req.file.filename,
    } , {new: true}).then(result=>{
        //console.log(result);
        res.status(200).redirect('/profile');
    }).catch(err=>{
        //console.log(err.message);
        res.status(400).redirect('/profile');
    });
});

// for update password
router.post('/profile/update-pasword/:userId' , protect_view , async (req , res)=>{
    await User.findById(req.params.userId).then(async result=>{
        const correct = await  bcrypt.compare(req.body.currentPassword , result.password);
        if (!correct){
            res.status(400).redirect('/profile');
        }
        result.password = req.body.password;
        result.passwordConfirm = req.body.passwordConfirm;
        await result.save().then(data=>{
            //console.log(data);
            res.status(200).redirect('/profile');
        }).catch(err=>{
            //console.log(err.message);
            res.status(400).redirect('/profile');
        });
    }).catch(err=>{
        //console.log(err.message);
        res.status(400).redirect('/profile');
    });
});

// for display all users
router.get('/users' , protect_view , async (req , res)=>{
    const users = await User.find();
    res.status(200).render('users', {
        title: 'add',
        user: req.user,
        users: users
    })
});


// for dispaly add book page 
router.get('/add' ,protect_view ,  (req , res)=>{
    res.status(200).render('add', {
        title: 'add',
        user: req.user
    });
});


// for add new book in books
router.post('/add', protect_view , upload_book_image , async (req , res)=>{
    //console.log(req.file);
    await Book.create({
        user: req.user._id,
            name: req.body.name,
            descrption: req.body.descrption,
            price: req.body.price,
            auther: req.body.auther,
            image: req.file.filename
    }).then((result)=>{
        //console.log(result);
        res.status(200).redirect('/');
    }).catch(err=>{
        //console.log(err.message);
        res.status(400).redirect('/add');
    });
});


// for add to cart function 
router.post('/add-to-cart/:bookId' ,  protect_view, async (req , res)=>{
    const book = await Book.findById(req.params.bookId);
    if (req.user){
        await Cart.create({
            user: req.user._id,
            book: req.params.bookId,
            quantity: req.body.quantity
        }).then(result=>{
            //console.log(result);
            res.status(200).redirect(`/my-cart`);
        }).catch(err=>{
            //console.log(err.message);
            res.status(400).redirect(`/book-detail/${book.slug}`);
        });
    }else{
        res.status(400).redirect(`/book-detail/${book.slug}`);
    }
});

// for display login page
router.get('/login' , (req , res)=>{
    res.status(200).render('login', {
        title: 'login',
    });
});



// for display register page
router.get('/register' , (req , res)=>{
    res.status(200).render('register', {
        title: 'register',
    });
});

// for display logout function
router.get('/logout' , (req , res)=>{
    res.cookie('jwt' , 'loggingout' , { httpOnly: true });
    res.status(200).redirect('/');
});


router.post('/login' , async (req , res)=>{
    await User.findOne({email: req.body.email}).then(async user=>{
        if (!user){
            res.status(400).redirect('/login');
        }
        const correct = await bcrypt.compare(req.body.password , user.password);
        if (!correct){
            res.status(400).redirect('/login');
        }
        const token = jwt.sign({id: user._id} , process.env.JWT , {
            expiresIn: '12h'
        });
        res.cookie('jwt' , token , {httpOnly: true});
        res.status(200).redirect('/');
    }).catch(err=>{
        res.status(400).redirect('/login');
    });
});

router.post('/register' , async (req , res)=>{
    const user = await User.findOne({email: req.body.email});
    if (user){
        res.status(200).redirect('/login');
    }
   await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        isAdmin: req.body.isAdmin,
        address: req.body.address
    }).then(newUser=>{
        //console.log(newUser);
        res.status(200).redirect('/login');
    }).catch(err=>{
        //console.log(err.message);
        res.status(400).redirect('/register');
    });
});

module.exports = router;