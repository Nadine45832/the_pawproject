const express = require('express');
const Pet = require('../models/pets');
const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        const pets = await Pet.find();
        res.json(pets);
      } catch (err) {
        next(new HttpError('Fetching pets failed, please try again later.', 500));
      }
});

router.get('/:id', async (req, res, next) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) throw new HttpError('Pet not found', 404);
        res.json(pet);
      } catch (err) {
        next(err);
      }
});

module.exports = router;