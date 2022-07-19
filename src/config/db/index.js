// Using Node.js `require()`
const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/f8_education_dev');
        console.log('connect sucessfuly!!!');
    } catch (error) {
        console.log('connect error!!!');
    }
}

module.exports = { connect };
