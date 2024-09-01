const express = require("express");
const authRouter = express.Router();
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const session = require('express-session');  

const uploadPath = path.join(__dirname, '../profile-images');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage }).single('profileImageUrl');
const jwtAuth = require('../middleware/jwtAuth.js');
const {
    signup,
    signin,
    getuser,
    userLogout,
    forgotPassword,
    resetPassword,
   updateUser,
   getAllUsers,
   getTopCustomers,
   verifyOtp
    
} = require("../controllers/userController.js");


authRouter.use(session({
  secret: 'ASDFGHJKL', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, 
}));

authRouter.use(passport.initialize());
authRouter.use(passport.session());

authRouter.post('/signup', upload, signup);
authRouter.post('/verifyOtp',verifyOtp)
authRouter.post('/signin', signin);
authRouter.get('/getuser', jwtAuth, getuser);
authRouter.get('/logout', jwtAuth, userLogout);
authRouter.post('/forgot-password', forgotPassword);
authRouter.put('/update',upload,jwtAuth,updateUser);
authRouter.post('/reset-password', resetPassword);
authRouter.use('/uploadss',express.static('profile-images'))
authRouter.get('/getAllUsers',getAllUsers)
authRouter.get('/getTopCustomers',getTopCustomers)


module.exports = authRouter;
