const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRole  = require('../../enums/user').userRole;  
const passport = require('passport');
const key = require('../../config/keys').secret
const User = require('../../models/User');

/**
 * @route POST api/users/register
 * @desc Register the User
 * @access Public
 */
router.post('/register', async (req, res) => {
    try {
        let {
            firstName,
            lastName,
            email,
            password,
            confirm_password,
            birthday, 
            identidyNumber, 
            departmentName, 
            registrationNumber 
        } = req.body;

        if (password !== confirm_password) {
            return res.status(400).json({
                msg: "Password do not match."
            });
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({
                msg: "Email is already registered. Did you forget your password."
            });
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            birthday, 
            identidyNumber, 
            departmentName, 
            registrationNumber 
        });

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);

        await newUser.save();

        return res.status(201).json({
            success: true,
            msg: "User is now registered."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server Error' });
    }
});

/**
 * @route POST api/users/login
 * @desc Signing in the User
 * @access Public
 */
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                msg: "Email not found.",
                success: false
            });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (isMatch) {
            const payload = {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            };
            const token = jwt.sign(payload, key, { expiresIn: 604800 });

            return res.status(200).json({
                success: true,
                token: `Bearer ${token}`,
                user: user,
                role: user.role,
                msg: "You are now logged in."
            });
        } else {
            return res.status(404).json({
                msg: "Incorrect password.",
                success: false
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server Error' });
    }
});

/**
 * @route POST api/users/profile
 * @desc Return the User's Data
 * @access Private
 */
router.post('/createUser', async (req, res) => {
    try {
       
        const {
            firstName,
            lastName,
            email,
            password,
            role,
            departmentName,
            departmentCode,
            birthday,
            identidyNumber,
            registrationNumber,
            payroll,
            wage,
            lawNo,
        } = req.body;

        // Check for the Unique Email
        const existingUser = await User.findOne({
            $or: [{ email }, { identidyNumber }],
        });

        if (existingUser) {
            return res.status(400).json({
                msg: "This user already registered",
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save the user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            departmentName,
            departmentCode,
            birthday,
            identidyNumber,
            registrationNumber,
            payroll,
            wage,
            lawNo,
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            msg: "User has been added.",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server Error' });
    }
});



/**
 * @route POST api/users/profile
 * @desc Return the User's Data
 * @access Private
 */
router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        return res.json({
            user: req.user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server Error' });
    }
});


/**
 * @route GET api/users/getAllProfiles
 * @desc Get all user profiles
 * @access Private
 */
router.get('/getAllProfiles', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.user.role !== userRole.ADMIN && req.user.role !== userRole.COMPANY_OWNER) {
            return res.status(403).json({ msg: "You don't have permission to access this resource." });
        }

        const allProfiles = await User.find({});

        return res.json({ profiles: allProfiles });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server Error' });
    }
});

/**
 * @route PUT api/users/updateProfile/:id
 * @desc Update a user's profile
 * @access Private (only for admins)
 */
router.put('/updateUser/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.user.role !== userRole.ADMIN && req.user.role !== userRole.COMPANY_OWNER) {
            return res.status(403).json({ msg: "You don't have permission to access this resource." });
        }

        const userId = req.params.id;
        const updatedData = req.body;

        const userToUpdate = await User.findById(userId);
        if (!userToUpdate) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update user's data
        userToUpdate.set(updatedData);
        await userToUpdate.save();

        return res.json({ success: true, msg: 'User profile updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server Error' });
    }
});


router.delete('/deleteUser/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.user.role !== userRole.ADMIN && req.user.role !== userRole.COMPANY_OWNER) {
            return res.status(403).json({ msg: "You don't have permission to access this resource." });
        }

        const userId = req.params.id;

        const userToDelete = await User.findByIdAndDelete(userId);
        if (!userToDelete) {
            return res.status(404).json({ msg: 'User not found' });
        }

        return res.json({ success: true, msg: 'User profile deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server Error' });
    }
});

/**
 * @route GET api/users/getEducators
 * @desc Get all user profiles with Educator role
 * @access Private (only for admins)
 */
router.get('/getEducators', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const educators = await User.find({ role: 'Educator' }, 'firstName lastName');

        return res.json({ educators });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Server Error' });
    }
});









module.exports = router;