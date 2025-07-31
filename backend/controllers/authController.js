const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//  Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, phone, address, photoURL } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      photoURL,
    });

    await newUser.save();

    //  Create token just like in login
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        photoURL: newUser.photoURL,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error in signup", error: error.message });
  }
};


//  Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const emailTrimmed = email.toLowerCase().trim();
const user = await User.findOne({ email: emailTrimmed });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
         id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isAdmin:user.isAdmin
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error during login", error: error.message });
  }
};

//  Profile Update (NEW)
exports.updateProfile = async (req, res) => {
  try {
    const { userId, name, email, phone, address, photoURL } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, address, photoURL },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        photoURL: updatedUser.photoURL
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};
