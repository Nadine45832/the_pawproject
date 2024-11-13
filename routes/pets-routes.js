const express = require('express');
const Pet = require('../models/pets');
const User = require('../models/user');
const router = express.Router();
const HttpError = require('../models/http-error');
const { check } = require("express-validator");
const {isAuthenticated} = require('../controllers/validate-auth.js');

router.get('/', async (req, res, next) => {
    try {
        const pets = await Pet.find();
        res.status(200).json(pets);
      } catch (err) {
        next(new HttpError('Fetching pets failed, please try again later.', 500));
      }
});

router.get('/:id', async (req, res, next) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) throw new HttpError('Pet not found', 404);
        res.status(200).json(pet);
      } catch (err) {
        next(err);
      }
});

router.post(
  '/add',
  isAuthenticated,
  [
    check("name").notEmpty().withMessage("Name is required").trim(),
    check("description").notEmpty().withMessage("Description is required").trim(),
    check("breed").notEmpty().withMessage("Breed is required").trim(),
    check("adoptionStatus").notEmpty().withMessage("Adoption status is required").trim(),
    check("age").notEmpty().withMessage("Age is required"),
    check("photoURL").notEmpty().withMessage("Photo URL is required").trim(),
  ],
  async (req, res, next) => {
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
    if (user.role !== 'admin') {
      const error = new HttpError(`Forbidden. You have not permission!`, 403);
      return next(error);
    }
    const { name, description, breed, adoptionStatus, age, photoURL } = req.body;
    try {
        const perObj = {
          name,
          description,
          breed,
          adoptionStatus,
          age,
          photoURL
        }

        await Pet.create(perObj);
      res.status(200).json(perObj);
    } catch (err) {
      const error = new HttpError(`Internal Server Error - ${err}`, 500);
      return next(error);
    }
});

module.exports = router;