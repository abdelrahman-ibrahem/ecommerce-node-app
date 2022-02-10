const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const multer = require('multer');

// handel upload image
const storage = multer.diskStorage({
    destination: (req , file , cb)=>{
        cb(null , 'public/img/users');
    },
    filename: (req , file , cb)=>{
        const ext = file.mimetype.split('/')[1];
        const f = file.originalname.split('.')[0];
        cb(null , `users-${f}-${Date.now()}.${ext}`);
    }
});

const upload  = multer({storage});
exports.upload_image_profile = upload.single('photo');

exports.signup =  async (req , res)=>{
    try{
        const user = await User.findOne({email: req.body.email});
        if (user){
            return res.status(400).json({
                status: "failed",
                message: "this email is already exists"
            });
        }
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            isAdmin: req.body.isAdmin,
            address: req.body.address
        });
        
        res.status(200).json({
            status: "success",
            user: {
                username: newUser.username,
                email: newUser.email,
                photo: newUser.photo,
                admin: newUser.isAdmin,
                address: newUser.address,
            }
        });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};


exports.login =  async (req , res )=>{
    try{
       const user = await User.findOne({email: req.body.email});
       if (!user){
           return res.status(400).json({
                status: "failed",
                message: "this account is not found"
            });
       }
       const correct = await bcrypt.compare(req.body.password , user.password);
       if (!correct){
        return res.status(400).json({
            status: "failed",
            message: "invalid password, please try again"
        });
       }
       const token = jwt.sign({id: user._id} , process.env.JWT, {
           expiresIn: '12h'
       });
       res.cookie('jwt' , token , {httpOnly: true});
       res.status(200).json({
           status: "success",
           token,
           user: {
                username: user.username,
                email: user.email,
                photo: user.photo,
                admin: user.isAdmin,
                address: user.address,
           }
       });
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: err.message
        });
    }
};

exports.protect = async (req , res , next)=>{
    try{
        let token;
        if (req.headers.authorization){
            token = req.headers.authorization;
        }else if (req.cookies.jwt){
            token = req.cookies.jwt;
        }
        if(!token){
            return res.status(401).json({
                status: "failed",
                message: "access denied"
            });
        }
        const decoded = jwt.verify(token , process.env.JWT);
        const current = await User.findById(decoded.id);
        req.user = current;
        next();
    }catch(err){
        res.status(404).json({
            status: "failed",
            message: "access denied"
        });
    }
}


exports.protect_view = async (req , res , next)=>{
    try{
        const token = req.cookies.jwt;
        if(!token){
            return next()
        }
        const decoded = jwt.verify(token , process.env.JWT);
        const current = await User.findById(decoded.id);
        req.user = current;
        next();
    }catch(err){
        next();
    }
}