const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const { cookieOpts } = require('../utils/constrains.js');
const serverConfig = require("../configs/server.js");

const login = async (req, res, next) => {

    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new HttpError("Authentication failed. Invalid credentials.", 403);
        }
        
        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) {
            throw new HttpError("Authentication failed. Invalid credentials.", 403);
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: existingUser._id, email: existingUser.email }, serverConfig.jwtSecret, {
            expiresIn: '30d',
        });

        const userObj = {
            email: existingUser.email,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            id: existingUser._id,
            phoneNumber: existingUser.phoneNumber,
            role: existingUser.role
        };

        res.status(200).cookie('token', token, cookieOpts).json(userObj);
    } catch (err) {
        return next(new HttpError("Login failed. Please try again.", 500));
    }
};

const signOut = async (req, res, next) => {
    res.clearCookie('token', cookieOpts);
    return res.status(200).json({ message: 'Sign-out successful' });
};

const getUserInformation = async (req, res) => {
    const { email } = res.locals;
    let user;
    try {
        user = await User.findOne({email});
    } catch (err) {
        const error = new HttpError(`Internal Server Error - ${err}`, 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError(`No user found`, 404);
        return next(error);
    }

    const userObj = {
        email: user.email,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role
    };

    return res.status(200).json(userObj);
};

const updateUser = async (req, res, next) => {

    const { email } = res.locals;
    const { firstName, lastName, phoneNumber, password } = req.body;

    let user;
    try {
        user = await User.findOne({email});
    }catch(err){
        const error = new HttpError('Something went wrong, could not update the user.', 500);
        return next(error);
    }
    if(!user) {
        const error = new HttpError('Could not find the user.', 404);
        return next(error);
    }
    if (firstName) {
        user.firstName = firstName;
    }
    if (lastName) {
        user.lastName = lastName;
    }
    if (phoneNumber) {
        user.phoneNumber = phoneNumber;
    }

    if (password) {
        user.password = password;
    }

    try{
        await user.save();
    }catch(err){
        const error = new HttpError('Something went wrong, could not update the user', 500);
        return next(error);
    }

    res.status(200).json({user: user.toObject()});
};

const signUp = async (req, res, next) => {

    const {
        email,
        password,
        firstName,
        lastName,
        phoneNumber
    } = req.body;

    try {
        const existingUser = await User.findOne({email});

        if (existingUser) {
            const error = new HttpError('Email already in use', 409);
            return next(error);
        }
        await User.create({
            email,
            password,
            firstName,
            lastName,
            phoneNumber
        });
    } catch (err) {
        const error = new HttpError(`Internal Server Error - ${err}`, 500);
        return next(error);
    }
    return res.status(201).json({"message": "Successfully signUp!"});
};

const updatePassword = async (req, res, next) => {

    const { password } = req.body;
    const { email } = res.locals;
    let user;
    try {
        user = await User.findOne({email});
    } catch (err) {
        const error = new HttpError(`Internal Server Error - ${err}`, 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError(`No user with email ${email}`, 500);
        return next(error);
    } 

    user.password = password;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
};

const getUsers = async (req, res, next) => {
    let users;
    try{
        users = await User.find();
    }catch(err){
        const error = new HttpError('Something went wrong, Could not find any users.', 500);
        return next(error);
    }
    res.status(200).json({users : users.map(u => u.toObject())});
};


const getCurrentUser = async (req, res, next) => {

    const { email } = res.locals;
    let user;
    try {
        user = await User.findOne({email});
    } catch (err) {
        const error = new HttpError(`Internal Server Error - ${err}`, 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError(`No user found`, 404);
        return next(error);
    }

    const userObj = {
        email: user.email,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role
    };

    return res.status(200).json(userObj);
};


module.exports = {
    login,
    signOut,
    getUserInformation,
    updateUser,
    signUp,
    updatePassword,
    getUsers,
    getCurrentUser
};
