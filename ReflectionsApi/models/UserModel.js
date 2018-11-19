﻿const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    'name': {
        type: 'String',
        trim: true,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    'email': {
        type: 'String',
        trim: true,
        required: true,
        minLength: 3,
        maxLength: 255
    },
    'password': {
        type: 'String',
        trim: true,
        required: true,
        minLength: 3,
        maxLength: 1024
    }
});

//__________________________________________________________________________________________________________
userSchema.methods.generateAuthToken = function () {

    const payload = {
        _id: this._id,
        name: this.name,
        roles: 'abiding'
    };

    return jwt.sign(payload, config.jwtPrivateKey);
}

const UserModel = mongoose.model('User', userSchema);

const userJoiSchema = {
    _id: Joi.objectId(),
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(3).max(255).required().email(),
    password: Joi.string().min(3).max(1924).required(),
}

//__________________________________________________________________________________________________________
function validateUser(user) {

    return Joi.validate(user, userJoiSchema);
}

exports.validateUser = validateUser;
exports.UserModel = UserModel;
