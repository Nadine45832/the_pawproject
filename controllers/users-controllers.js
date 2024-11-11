const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const cookieOpts = require('../utils/constrains.js');
const { validationResult } = require('express-validator');
const serverConfig = require("../configs/server.js");

const login = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError("Invalid input, please check data!", 422));
    }
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

        res.status(200).cookie('token', token, cookieOpts).json(existingUser);
    } catch (err) {
        return next(new HttpError("Login failed. Please try again.", 500));
    }
};

const signOut = async (req, res, next) => {
    res.clearCookie('token', cookieOpts);
    return res.status(200).json({ message: 'Sign-out successful' });
};

const getUserInformation = async (req, res) => {
    const userId = req.params.uid;
    const user = await User.findById(userId);

    if (!user) {
        const error = new HttpError(`No user found`, 404);
        return next(error);
    }

    const userObj = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role
    };

    return res.status(200).json(userObj);
};

const updateUser = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError("Invalid input, please check data!", 422));
    }

    const userId = req.params.uid;
    const { firstName, lastName, phoneNumber } = req.body;

    let user;
    try {
        user = await User.findById(userId);
    }catch(err){
        const error = new HttpError('Something went wrong, could not update the user.', 500);
        return next(error);
    }
    if(!user) {
        const error = new HttpError('Could not find the user for the provided user id.', 404);
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

    try{
        await user.save();
    }catch(err){
        const error = new HttpError('Something went wrong, could not update the user', 500);
        return next(error);
    }

    res.status(200).json({user: user.toObject()});
};

const signUp = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError("Invalid input, please check data!", 422));
    }
    const {
        email,
        password,
        firstName,
        lastName,
        phoneNumber
    } = req.body;
    const userId = req.params.uid;

    try {
        const existingUser = await User.findById(userId);

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
    return res.status(201).json({});
};

const updatePassword = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError("Invalid input, please check data!", 422));
    }
    const { newPassword } = req.body;
    const userId = req.params.uid;

    const user = await User.findById(userId);

    if (!user) {
        const error = new HttpError(`No user with email ${email}`, 500);
        return next(error);
    }

    user.password = newPassword;
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

module.exports = {
    login,
    signOut,
    getUserInformation,
    updateUser,
    signUp,
    updatePassword,
    getUsers
};
