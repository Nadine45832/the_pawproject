const HttpError = require('../models/http-error');
const Pet = require('../models/pets');
const User = require('../models/user');
const isAdmin = require('../utils/utils');



const addPet = async (req, res, next) => {
    const { email } = res.locals;
    const { status, error } = await isAdmin(email);
    if (!status) {
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
};


const deletePet = async (req, res, next) => {
    const { email } = res.locals;
    const { status, error } = await isAdmin(email);
    if (!status) {
        return next(error);
    }
    try {
        await Pet.deleteOne({_id: req.params.id});
      res.status(200).json({message: 'The pet successfully deleted!'});
    } catch (err) {
      const error = new HttpError(`Internal Server Error - ${err}`, 500);
      return next(error);
    }
};

const updatePet = async (req, res, next) => {
    const { email } = res.locals;
    const { name, description, breed, adoptionStatus, age, photoURL } = req.body;
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
    if (photoURL) {
        pet.photoURL = photoURL;
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