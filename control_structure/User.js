const userModel = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
// Register a new user
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                status: 'Failed',
                message: 'All fields are required',
            });
        }

        // Check for existing user
        const existingUser = await userModel.findOne({ email });
        console.log({ existingUser });
        if (existingUser) {
            return res.status(409).json({
                status: 'Failed',
                message: 'User already exists',
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
        });

        // Generate JWT token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60 * 1000,
        });
        res.cookie("token", token);
        res.status(201).json({
            status: 'Success',
            message: 'User created successfully',
            token,
            name: user.name,
            id: user._id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'Failed',
            message: 'Server error occured',
        });
    }
};

// Login user
const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("reqbody",req.body)
    // Validate input
    if (!email || !password) {
        return res.status(400).json({
            status: 'Failed',
            message: 'Email and password are required',
        });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Either your email or password is incorrect',
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("Password Valid==>",isPasswordValid)
        if (!isPasswordValid) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Either your email or password is incorrect',
            });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 60*30*1000,
        });
        res.cookie("token", token);
        console.log("login ke andr token",token)
        console.log("user",user)
        return res.json({
            status: 'Success',
            message: 'User logged in successfully',
            token,
            name: user.name,
            id:user._id,
        });
    } catch (error) {
        console.log("ye hai backend ka error bhai!!")
        console.error('Login error:', error);
        return res.status(500).json({
            status: 'Failed',
            message: 'An error occurred during login',
            error: error
        });
    }
};


// // Update user password
// const updatePassword = async (req, res) => {
//     const { email, oldPassword, newPassword } = req.body;

//     try {
//         console.log("email aaya ki nhi ?", email);
//         const user = await userModel.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         console.log('Old password:', oldPassword);
//         console.log('Stored hashed password:', user.password);

//         // Validate old password
//         const isMatch = await bcrypt.compare(oldPassword, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Old password is incorrect' });
//         }

//         // Hash and update new password
//         const hashedPassword = await bcrypt.hash(newPassword, 12);
//         await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });

//         res.status(200).json({ message: 'Password updated successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

const updateSettings=async(req,res)=>{
    const { name, email, currentPassword, newPassword } = req.body;

    try {
        const user = await userModel.findById(req.user.id); 

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is trying to update their name
        if (name) {
            user.name = name;
            await user.save();
            return res.status(200).json({ message: 'Name updated successfully' });
        }

        // Check if the user is trying to update their email
        if (email) {
            // Check if the email is already in use
            const emailExists = await userModel.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email is already in use' });
            }
            user.email = email;
            await user.save();
            return res.status(200).json({ message: 'Email updated successfully' });
        }

        // Check if the user is trying to update their password
        if (currentPassword && newPassword) {
            console.log("currentpaswword",currentPassword);
            console.log("passord",user.password);
            const isMatch =  await bcrypt.compare(currentPassword, user.password) ;
            console.log(isMatch)
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }
            const hashedPassword=await bcrypt.hash(newPassword,12);
            user.password = hashedPassword; 
            await user.save();
            return res.status(200).json({ message: 'Password updated successfully' });
        }

        return res.status(400).json({ message: 'No valid fields provided for update' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
const assignee= async(req,res)=>{
try {
    const users = await userModel.find({}, 'email'); // Only fetch email field
    const emails = users.map(user => user.email);
    res.json(emails);
    console.log(emails);
} catch (error) {
    console.error('Error fetching assignees:', error);
    res.status(500).json({ message: 'Server error' });
}
};
// Logout user
const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ status: 'Success', message: 'Logged out successfully' });
};

module.exports = { register, login, logout,  assignee,updateSettings };
