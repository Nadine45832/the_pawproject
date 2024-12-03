const HttpError = require('../models/http-error');
const Pet = require('../models/pets');
const isAdmin = require('../utils/utils');
const fs = require("fs");

const addPet = async (req, res, next) => {
    const { email } = res.locals;
    const { status, error } = await isAdmin(email);
    if (!status) {
        return next(error);
    }
    const { name, description, breed, adoptionStatus, age } = req.body;
    try {
        const perObj = {
          name,
          description,
          breed,
          adoptionStatus,
          age,
          photoURL: req.file.path.startsWith("/") ? req.file.path : `/${req.file.path}`,
        }

        await Pet.create(perObj);
      res.status(200).json(perObj);
    } catch (err) {
      const error = new HttpError(`Internal Server Error - ${err}`, 500);
      return next(error);
    }
};


const deletePet = async (req, res, next) => {
    const { email } = res.locals;
    const { status, error } = await isAdmin(email);
    if (!status) {
        return next(error);
    }
    let pet;
    try {
        pet = await Pet.findById(req.params.id);
    } catch (err) {
        const error = new HttpError(
        "Something went wrong, could not delete pet.",
        500
        );
        return next(error);
    }
    const imagePath = pet.photoURL;
    try {
        await Pet.deleteOne({_id: req.params.id});
        fs.unlink(imagePath, (err) => {
            console.log(err);
          });
      res.status(200).json({message: 'The pet successfully deleted!'});
    } catch (err) {
      const error = new HttpError(`Internal Server Error - ${err}`, 500);
      return next(error);
    }
};

const updatePet = async (req, res, next) => {
    const { email } = res.locals;
    const { name, description, breed, adoptionStatus, age, photoURL } = req.body;
    const imageURL = req.file ? (req.file.path.startsWith("/") ? req.file.path : `/${req.file.path}`) : photoURL;
    const { status, error } = await isAdmin(email);
    if (!status) {
        return next(error);
    }

    let pet;
    try {
        pet = await Pet.findById(req.params.id);
    }catch(err){
        const error = new HttpError('Something went wrong, could not update the pet.', 500);
        return next(error);
    }
    if(!pet) {
        const error = new HttpError('Could not find the pet.', 404);
        return next(error);
    }

    if (name) {
        pet.name = name;
    }
    if (description) {
        pet.description = description;
    }
    if (breed) {
        pet.breed = breed;
    }
    if (adoptionStatus) {
        pet.adoptionStatus = adoptionStatus;
    }
    if (age) {
        pet.age = age;
    }
    if (imageURL) {
        pet.photoURL = imageURL;
    }
    try {
        await pet.save();
      res.status(201).json(pet);
    } catch (err) {
      const error = new HttpError(`Internal Server Error - ${err}`, 500);
      return next(error);
    }
};




module.exports = {
    addPet,
    deletePet,
    updatePet
};