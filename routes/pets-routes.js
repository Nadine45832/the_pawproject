const express = require('express');
const Pet = require('../models/pets');
const User = require('../models/user');
const router = express.Router();
const HttpError = require('../models/http-error');
const { check } = require("express-validator");
const petsControllers = require("../controllers/pets-controllers.js");
const {isAuthenticated} = require('../controllers/validate-auth.js');
const fileUpload = require("../middleware/file-upload");

router.get('/', async (req, res, next) => {
    try {
        const pets = await Pet.find();
        res.status(200).json({pets: pets.map(p => p.toObject())});
      } catch (err) {
        next(new HttpError('Fetching pets failed, please try again later.', 500));
      }
});

router.get('/:id', async (req, res, next) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet){return next(new HttpError('Pet not found', 404))};
        res.status(200).json(pet);
      } catch (err) {
        next(new HttpError('Fetching pet failed, please try again later.', 500));
      }
});


router.post(
  '/add',
  isAuthenticated,
  [
    check("name").notEmpty().withMessage("Name is required").trim(),
    check("description").notEmpty().withMessage("Description is required").isLength({ max: 600 }).withMessage("Description must not exceed 600 characters").trim(),
    check("breed").notEmpty().withMessage("Breed is required").trim(),
    check("adoptionStatus").notEmpty().isIn(['Available', 'Adopted', 'Pending']).withMessage('Adoption status must be one of: Available, Adopted, Pending').trim(),
    check("age").notEmpty().isNumeric().withMessage('Age must be a number'),
    fileUpload.single("file"),
  ], petsControllers.addPet
);

router.delete(
  '/delete/:id',
  isAuthenticated, petsControllers.deletePet
);


router.put(
  '/update/:id',
  isAuthenticated,
  [
    check("name").optional().trim(),
    check("description").optional().isLength({ max: 600 }).withMessage("Description must not exceed 600 characters").trim(),
    check("breed").optional().trim(),
    check("adoptionStatus").optional().isIn(['Available', 'Adopted', 'Pending']).withMessage('Adoption status must be one of: Available, Adopted, Pending'),
    check("age").optional().isNumeric().withMessage('Age must be a number'),
    fileUpload.single("file"),
  ],
  petsControllers.updatePet
);


module.exports = router;