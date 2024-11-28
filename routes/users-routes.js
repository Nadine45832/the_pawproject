const express = require("express");
const { check } = require("express-validator");
const usersControllers = require("../controllers/users-controllers");
const validateRequest = require("../middleware/validate-request");
const {isAuthenticated} = require('../controllers/validate-auth.js');

const userRouter = express.Router();


userRouter.get("/", usersControllers.getUsers);

userRouter.post(
    "/signup",
    [
        check("firstName").trim().notEmpty().withMessage("First name is required"),
        check("lastName").trim().notEmpty().withMessage("Last name is required"),
        check("password")
            .notEmpty()
            .isStrongPassword({ minLength: 8, minLowercase: 1, minNumbers: 1, minSymbols: 1 })
            .withMessage("Password must be at least 8 characters long, contain at least one lowercase letter, one number, and one symbol"),
        check("phoneNumber").optional().trim().isMobilePhone().withMessage("Invalid phone number format, please try again"),
        check("email")
            .trim()
            .notEmpty()
            .isEmail()
            .withMessage("Valid email is required"),
    ],
    usersControllers.signUp
);

userRouter.post(
    "/login",
    [
        check("email").trim().notEmpty().isEmail().withMessage("Valid email is required"),
        check("password").notEmpty().withMessage("Password is required"),
    ],
    validateRequest,
    usersControllers.login
);

userRouter.put(
    "/:uid",
    isAuthenticated,
    [
        check("firstName").optional().trim(),
        check("lastName").optional().trim(),
        check("phoneNumber").optional().trim().isMobilePhone().withMessage("Invalid phone number format, please try again."),
        check("password")
        .optional()
        .isStrongPassword({ minLength: 8, minLowercase: 1, minNumbers: 1, minSymbols: 1 })
        .withMessage("Password must be at least 8 characters long, contain at least one lowercase letter, one number, and one symbol")
    ],
    usersControllers.updateUser
);

userRouter.get('/:uid', isAuthenticated, usersControllers.getUserInformation);

userRouter.put(
    "/reset-password/:uid",
    isAuthenticated,
    [
        check("password")
        .notEmpty()
        .isStrongPassword({ minLength: 8, minLowercase: 1, minNumbers: 1, minSymbols: 1 })
        .withMessage("Password must be at least 8 characters long, contain at least one lowercase letter, one number, and one symbol")
    ],
    usersControllers.updatePassword
);

userRouter.get(
    "/get-current-user",
    isAuthenticated,
    usersControllers.getCurrentUser
);

module.exports = userRouter;
