const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    places: [{
        type: mongoose.Types.ObjectId,
        ref: 'Place'
    }]
});

userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User', userSchema)