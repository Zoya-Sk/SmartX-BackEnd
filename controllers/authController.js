const OTP = require("../models/otp");
const otpGenerator = require("otp-generator");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const { fileUpload } = require("../utils/cloudUpload"); 

// create and send otp
exports.createOtp = async (req, res) => {
  try {
    //fetch email
    const { email } = req.body;

    //validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the input fields",
      });
    }

    // check if user already have an account
    const userDetails = await User.findOne({ email: email });

    if (userDetails) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }

    // generate OTP
    const otp = otpGenerator.generate(4, {
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });

    // create entry in DB
    const newOtp = await OTP.create({
      email: email,
      otp: otp,
    });

    // return response
    return res.status(200).json({
      success: true,
      message: "OTP Created successfully",
      newOtp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// sign up
exports.signUp = async (req, res) => {
  try {
    // fetch data
    const { firstName, lastName, password, confirmPassword, otp, email } =
      req.body;

    // validtion
    if (
      !firstName ||
      !lastName ||
      !password ||
      !confirmPassword ||
      !otp ||
      !email
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the Input fields",
      });
    }

    // check if the password and confirm password are same or not
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password & confirm password didn't matched",
      });
    }

    // check if the user is already registered or not
    const userExistence = await User.findOne({ email: email });

    if (userExistence) {
      return res.status(400).json({
        success: false,
        message: "User already Exists",
      });
    }

    // find latest OTP
    const latestotp = await OTP.findOne({ email: email }).sort({
      createdAt: -1,
    });

    if (!latestotp) {
      return res.status(404).json({
        success: false,
        message: "OTP not found!",
      });
    }

    // verify OTP
    if (otp !== latestotp.otp) {
      return res.status(400).json({
        success: false,
        message: "OTP not matched",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create profile picture
    const profilePicture =
      await `https://api.dicebear.com/9.x/initials/svg?seed=${firstName}%20${lastName}`;

    // create entry in DB
    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      profilePicture: profilePicture,
    });

    // return response
    return res.status(200).json({
      success: true,
      message: "Account Created Successfully!",
      newUser: newUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// login
exports.login = async (req, res) => {
  try {
    // fetch data
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all the input fields",
      });
    }

    // check if the email is registered or not
    const userDetails = await User.findOne({ email: email });

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "Email not Registered!",
      });
    }

    // compare passwords
    const isMatched = await bcrypt.compare(password, userDetails.password);

    // if password matched
    if (isMatched) {
      const payload = {
        userId: userDetails._id,
        userEmail: userDetails.email,
      };

      // create token]
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      userDetails.password = undefined;

      // return response
      return res.status(200).json({
        success: true,
        message: "Login Successfully",
        userDetails: userDetails,
        token: token,
      });

      // if password is incorrect
    } else {
      return res.status(403).json({
        success: false,
        message: "Incorrect password!",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// send OTP for reset password
exports.sendOtpForgotPassword = async (req, res) => {
  try {
    //fetch email
    const { email } = req.body;

    //validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the input fields",
      });
    }

    // check if user already have an account
    const userDetails = await User.findOne({ email: email });

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User not Registered",
      });
    }

    // generate OTP
    const otp = otpGenerator.generate(4, {
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });

    // create entry in DB
    const newOtp = await OTP.create({
      email: email,
      otp: otp,
    });

    // return response
    return res.status(200).json({
      success: true,
      message: "OTP Created successfully",
      newOtp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// verify OTP
exports.forgotPasswordVerifyOtp = async (req, res) => {
  try {
    // fetch data
    const { otp, email } = req.body;

    // validation
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "Please enter a 4-digit valid OTP",
      });
    }
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Something went Wrong!",
      });
    }

    // find latest OTP
    const latestOtp = await OTP.findOne({ email: email }).sort({
      createdAt: -1,
    });
    if (!latestOtp) {
      return res.status(404).json({
        success: false,
        message: "Invalid or expired OTP. Please try again.",
      });
    }

    // verify OTP
    if (latestOtp.otp !== otp) {
      return res.status(403).json({
        success: false,
        message: "Incorrect OTP. Please try again.",
      });
    }

    // return response
    return res.status(200).json({
      success: true,
      message: "OTP verified successsfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    // fetch data
    const { password, confirmPassword, email } = req.body;

    // validation
    if (!password || !confirmPassword || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // check if both passwords are same
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update password
    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true },
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// profile picture update
exports.updateProfilePicture = async (req, res) => {
  try {
    const { image } = req.files;

    // validation
    if(!image){
      return res.status(400).json({
        success:false,
        message:"Please Select the Image",
      })
    }
    
    const userId = req.body.userId;

    // validation
    if(!userId){
      return res.status(400).json({
        success:false,
        message:"User ID is required!",
      })
    }

    // upload image to the cloudinary
    const uploadImage = await fileUpload(image,process.env.FOLDER_NAME);
    console.log("Full cloudinary response:", uploadImage); 

    // update profile picture
    const updatedUser = await User.findByIdAndUpdate(userId,{
      profilePicture:uploadImage.secure_url,
    },{new:true}).select("-password");

    // return response
    return res.status(200).json({
      success:true,
      message:"Profile Picture Updated Successfully",
      updatedUser:updatedUser,
    })

  } catch (error) {
    console.log("fileUpload threw error:", error.message); // ✅ catch it here
    return res.status(500).json({
      success:false,
      message:"Internal Server Error!",
    })
    
  }
};

// update firstname, lastname and contactnumber
exports.nameUpdate = async(req,res)=>{
  try {
    // fetch data
    const { firstName, lastName, contactNumber, userId } = req.body;

    // validation 
    if(!firstName || !lastName || !contactNumber || !userId){
      return res.status(400).json({
        success:false,
        message:"Please fill all the Input Fields",
      })
    }

    // update user name
    const updatedUser = await User.findByIdAndUpdate(userId,{
      firstName:firstName,
      lastName:lastName,
      contactNumber:contactNumber,
    },{new:true}).select("-password");

    // retrun response
    return res.status(200).json({
      success:true,
      message:"Name Updated Successfully!",
      updatedUser:updatedUser,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Internal Server Error",
      })
  }
}

// update password
exports.passwordUpdate = async(req,res)=>{
  try {
    // fetch data
    const { currentPassword, changedPassword, userId } = req.body;

    // validation 
    if(!currentPassword || !changedPassword || !userId){
      return res.status(400).json({
        success:false,
        message:"Please fill all the Input Fields!",
      })
    }

    // find user details
    const userDetails = await User.findById(userId);
    
    // match current password
    const isMatched = await bcrypt.compare(currentPassword, userDetails.password);

    if(!isMatched){
      return res.status(400).json({
        success:false,
        message:"Current Password not Matched",
      })
    }

    // hash the changed password
    const hashedPassword = await bcrypt.hash(changedPassword,10);

    // update password
    const updatedUser = await User.findByIdAndUpdate(userId,{
      password:hashedPassword,
    },{new:true});

    // return response
    return res.status(200).json({
      success:true,
      message:"Password Updated Successfully!",
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success:false,
      message:"Internal Server Error",
    })
    
  }
}