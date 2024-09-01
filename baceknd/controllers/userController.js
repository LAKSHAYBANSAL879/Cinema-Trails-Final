const User =require('../models/userModel.js');
const emailValidator = require("email-validator");
const jwt=require('jsonwebtoken');
const crypto = require("crypto");
const bcrypt=require('bcrypt');
const nodemailer=require("nodemailer")
const Booking=require('../models/bookingModel.js');

const multer = require('multer');
const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: 'lbansal879880@gmail.com',
    pass: 'tajuooanjzkslnnn'
  }
});
const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: process.env.EMAIL,
          pass: process.env.PASS  
      }
  });

  const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`
  };

  await transporter.sendMail(mailOptions);
};

exports.signup = async (req, res) => {
  try {
      const { name, email, password, phone, city, state, country } = req.body;
      if (!name || !email || !password || !phone) {
          throw new Error("All fields are required");
      }

      const validateEmail = emailValidator.validate(email);
      if (!validateEmail) {
          throw new Error("Please enter a valid email address");
      }

      const adminCount = await User.countDocuments({ role: 'admin' });

      let user;
      const profileImageUrl = req.file ? req.file.filename : null;

      if (adminCount === 0) {
          user = new User({ name, email, password, phone, city, state, country, role: 'admin', profileImageUrl });
      } else {
          user = new User({ name, email, password, phone, city, state, country, role: 'user', profileImageUrl });
      }

      // Generate OTP
      const otp = crypto.randomInt(100000, 999999).toString();
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

      await user.save();

      // Send OTP to user's email
      await sendOtpEmail(email, otp);

      res.status(201).json({
          success: true,
          message: "OTP sent to your email. Please verify to complete signup.",
          data: { userId: user._id }
      });
  } catch (error) {
      if (error.code === 11000) {
          res.status(400).json({ success: false, message: 'User already registered with this email' });
      } else {
          console.log(error);
          res.status(400).json({ success: false, message: error.message });
      }
  }
};

// Route to verify OTP
exports.verifyOtp = async (req, res) => {
  try {
      const { userId, otp } = req.body;

      const user = await User.findById(userId);
      if (!user) {
          return res.status(400).json({ success: false, message: "User not found" });
      }

      if (user.otp !== otp || user.otpExpires < Date.now()) {
          return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
      }

      // OTP is correct, activate the user
      user.isVerified = true;
      user.otp = undefined;
      user.otpExpires = undefined;

      await user.save();

      res.status(200).json({ success: true, message: "OTP verified. Signup completed." });
  } catch (error) {
      console.log(error);
      res.status(400).json({ success: false, message: "OTP verification failed" });
  }
};
// exports.signup = async (req, res) => {
//   try {
//     // console.log('Request:', req);
//     console.log('Request Body:', req.body);
//         console.log('Request File:', req.file);
//       const { name, email, password, phone, city,state,country } = req.body;
//       if (!name || !email || !password || !phone) {
//           throw new Error("All fields are required");
//       }

//       const validateEmail = emailValidator.validate(email);
     
//       if (!validateEmail) {
//         throw new Error("Please enter a valid email address");
//     }

   
//     const adminCount = await User.countDocuments({ role: 'admin' });

//     let user;

//     if (adminCount === 0) {
//         // If no admin exists, create an admin
//         user = await User.create({
//             name,
//             email,
//             password,
//             phone,
//             city,
//             state,
//             country,
//             role: 'admin', 
//         });
//     } else {
//       const profileImageUrl=req.file.filename;
//         user = await User.create({
//             name,
//             email,
//             password,
//             phone,
//             city,
//             state,
//             country,
//             role: 'user',  
//             profileImageUrl
//         });
//     }

//       res.status(201).json({
//           success: true,
//           message: "User signup successfully",
//           data: { user }
//       });
//   } catch (error) {
//       if (error.code === 11000) {
//           res.status(400).json({
//               success: false,
//               message: 'User already registered with this email',
//           });
//       } else {
//           console.log(error);
//           res.status(400).json({
//               success: false,
//               message: error.message,
//           });
//       }
//   }
// };
exports.updateUser = async (req, res) => {
  try {
    // const { userId } = req.context; 
    const { name, email, phone, city,state,country } = req.body;
    const user = await User.findOne({ _id: req.body.userId });
    
    let profileImageUrl;
    if (req.file) {
      profileImageUrl = req.file.filename;
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.city = city || user.city;
    user.state = state || user.state; 
    user.country = country || user.country; 

    
    if (profileImageUrl) {
      user.profileImageUrl = profileImageUrl;
    }

   
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User details updated successfully',
      data: { user },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign({ userId: user._id,name: user.name  }, process.env.SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      token,
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already registered with this email',
      });
    } else {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
};

    exports.getuser = async (req, res) => {
        try {
          const user = await User.findOne({ _id: req.body.userId });
          return res.status(200).send({
            success: true,
            message: "User Fetched Successfully",
            user,
          });
        } catch (error) {
          console.log(error);
          return res.status(500).send({
            success: false,
            message: "unable to get current user",
            error,
          });
        }
    };
    const JWT = require("jsonwebtoken");

    exports.userLogout = (req, res, next) => {
      try {
        const cookieOptions = {
          expires: new Date(0), 
          httpOnly: true,
        };
    
        res.cookie("token", null, cookieOptions);
        
        res.status(200).json({
          success: true,
          message: "User logged out successfully",
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    };
  
    exports.forgotPassword = async (req, res, next) => {
      const email = req.body.email;
    
      // return response with error message if email is undefined
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required"
        });
      }
    
      try {
        // retrieve user using the given email.
        const user = await User.findOne({ email });
    
        // return response with error message if user not found
        if (!user) {
          return res.status(400).json({
            success: false,
            message: "User not found"
          });
        }
    
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
        // Hash OTP and set it with expiry
        user.forgotPasswordToken = crypto.createHash("sha256").update(otp).digest("hex");
        user.forgotPasswordExpiryDate = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    
        await user.save();
    
        // Send OTP via email
        const mailOptions = {
          from: 'lbansal879880@gmail.com',
          to: user.email,
          subject: 'Password Reset OTP',
          text: `Your OTP for password reset is ${otp}. This OTP is valid for 10 minutes.`
        };
    
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('Error sending email:', error);
            return res.status(500).json({
              success: false,
              message: 'Error sending OTP email'
            });
          }
          console.log('Email sent: ' + info.response);
        });
    
        return res.status(200).json({
          success: true,
          message: "OTP sent to your email"
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
    };
    
    exports.resetPassword = async (req, res) => {
      const { otp, password } = req.body;
      console.log('OTP:', otp);
      console.log('New Password:', password);
    
      // Return error message if OTP or password is missing
      if (!otp || !password) {
        return res.status(400).json({
          success: false,
          message: "OTP and new password are required"
        });
      }
    
      const hashToken = crypto.createHash("sha256").update(otp).digest("hex");
    
      try {
        // Find the user using the hashed OTP and check the expiration date
        const user = await User.findOne({
          forgotPasswordToken: hashToken,
          forgotPasswordExpiryDate: {
            $gt: new Date() // forgotPasswordExpiryDate greater than the current date
          }
        });
    
        // Return the message if user not found
        if (!user) {
          return res.status(400).json({
            success: false,
            message: "Invalid OTP or OTP is expired"
          });
        }
    
        // Update the user's password and save to the database
        user.password = password;
        // Clear the OTP and expiry date fields
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiryDate = undefined;
    
        await user.save();
    
        // Log success message and send the response
        console.log('Password successfully reset for user:', user.email);
        return res.status(200).json({
          success: true,
          message: "Successfully reset the password"
        });
      } catch (error) {
        // Log the error and send an error response
        console.error('Error resetting password:', error);
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }
    };  
    exports.getAllUsers = async (req, res) => {
      try {
          const userDetails = await User.find(); 
          res.status(200).json(userDetails);
        } catch (error) {
          res.status(500).send('Server Error');
        }
    };
    exports.getTopCustomers = async (req, res) => {
      try {
        const topCustomers = await Booking.aggregate([
          {
            $group: {
              _id: '$user',
              totalSpent: { $sum: '$totalPrice' },
              totalTickets: { $sum: '$totalTickets' },
            },
          },
          {
            $sort: { totalSpent: -1 },
          },
          {
            $limit: 5,
          },
          {
            $lookup: {
              from: 'users',
              localField: '_id',
              foreignField: '_id',
              as: 'userDetails',
            },
          },
          {
            $unwind: '$userDetails',
          },
          {
            $project: {
              _id: 0,
              userId: '$_id',
              totalSpent: 1,
              totalTickets: 1,
              name: '$userDetails.name',
              email: '$userDetails.email',
            },
          },
        ]);
    
        res.status(200).json(topCustomers);
      } catch (error) {
        res.status(500).json({ error: 'Server Error' });
      }
    };