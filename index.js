const express = require('express');
const app = express();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const userRouter = require('./routes/user');
const bookRouter = require('./routes/book');
const CartRouter = require('./routes/cart');
const viewRouter = require('./routes/view');
const contactRouter = require('./routes/contact');
const dotenv = require('dotenv');
const xss = require('xss-clean');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');


dotenv.config({ path:"config.env" })

// handel view engine
app.set('view engine' , 'pug');

// handel views and public folders
app.set('views', path.join(__dirname , 'views'));
app.use(express.static(path.join(__dirname , 'public')));

// handel middelware
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(xss());
app.use(mongoSanitize());
if (process.env.NODE_ENV==='development')
    app.use(morgan('dev'));

// handel db connection
//'mongodb://localhost/node-book-store'
mongoose.connect(`${process.env.DATABASE}` , { useNewUrlParser: true, useUnifiedTopology: true  }).then(()=>{
    console.log('DB is conncted');
}).catch(err=>{
    console.log(`Error: ${err.message}`);
});

// handel routes / api and views 
// for view pages
app.use('/' , viewRouter); 
// for api 
app.use('/api/v1/users' , userRouter);
app.use('/api/v1/books' , bookRouter);
app.use('/api/v1/orders' , CartRouter)
app.use('/api/v1/contacts' , contactRouter);
// handel running server on port 3000 

app.listen(3000, ()=>{
    console.log('server is Running');
});