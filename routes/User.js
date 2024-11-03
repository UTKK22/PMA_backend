const express = require('express');
const {
    register: registerUser,
    login: loginUser,
    logout: logoutUser,
    updateSettings,
    assignee
} = require('../control_structure/User')

const {isAuthenticated}=require('../authorization/Auth');
const router = express.Router();
router.post('/signup', async (req, res) => {
    try {
        await registerUser(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Signup error occurred', error: error.message });
    }
});

router.post('/login',async (req, res) => {
    console.log("Login call kiya gya hai routes/user.js")
    try {
        console.log(req.body)
        console.log(req.cookies)
        await loginUser(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Login error occurred', error: error.message });
    }
});

router.put('/update-settings', isAuthenticated, async (req, res) => {
   try {
      await updateSettings(req,res);
   } catch (error) {
    res.status(500).json({ message: 'Update error occurred', error: error.message });
   }
});


router.post('/logout', isAuthenticated, async (req, res) => {
    try {
        await logoutUser(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Logout error occurred', error: error.message });
    }
});

router.get('/assignees',isAuthenticated,async (req, res) => {
    try {
        await assignee(req,res);
    } catch (error) {
        console.error('Error fetching assignees:', error);
        res.status(500).json({ message: 'Assignee error',error:error.message });
    }
});

module.exports = router;
