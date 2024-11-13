const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    breed: { type: String, required: true },
    description: { type: String, required: true },
    photoURL: { type: String, required: true },
    adoptionStatus: { type: String, default: 'Available' },
});

module.exports = mongoose.model('Pet', petSchema);