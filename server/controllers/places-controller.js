const fs = require('fs')
const RequestError = require('../models/http-error');
const { validationResult } = require('express-validator');
const uuid = require('uuid');
const getCoordinates = require('../util/dummyLocation')
const Place = require('../models/Place');
const User = require('../models/User');
const mongoose = require('mongoose');

const getPlacesByUser = async ( req, res, next ) => {

    const userId = req.params.uid;
    let user;

    try {
        user = await User.findById(userId).populate('places');
        console.log(user);
        console.log(user.places);
    } catch (e) {
        console.log(e)
        const error = new RequestError("Could not get user places!", 500)
        return next(error)
    }

    if (!user || user.places.length == 0){
        const error = new RequestError('There is no places Created by this user', 400)
        return next(error)
    }
    
    res.status(200);
    res.json(user.places);
};

const getPlaceById = async ( req, res, next ) => {

    const placeId = req.params.pid;
    let place  
    try {
        place = await Place.findById(placeId);
    } catch (e) {
        console.log(e)
        const error = new RequestError(`Could not get place ${placeId}`, 500)
        return next(error)
    }
    if (!place){
        const error = new RequestError('place not found', 404)
        return next(error)
    }
    res.status(200);
    res.json(place);
};

const addPlace = async ( req, res, next ) => {
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors.errors);

        const error = new RequestError("Invalid Inputs", 422);
        
        return next(error)
    }

    const { title, descripetion, address, creator} = req.body
    const coordinates = getCoordinates(address);

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (e) {
        console.log(e);
        const error = new RequestError("Creating Place failed", 500);  
        return next(error)
    };
    if(!user){
        const error = new RequestError("Could not find user ID", 404);  
        return next(error)
    }
    const place = new Place({
        _id: uuid.v4().split('-').join("").substring(0,24),
        title,
        descripetion,
        location: coordinates,
        image: req.file.path,
        address,
        creator: req.userData.userId
    });

    console.log(mongoose.isObjectIdOrHexString(user._id))
    mongoose.isObjectIdOrHexString
    try {
        const session = await mongoose.startSession();
        await session.startTransaction();
        await place.save({ session: session });
        user.places.push(place);
        await user.save({ session: session });
        await session.commitTransaction();

    } catch (e) {
        console.log(e)
        const error = new RequestError('Adding place failed plaese try again', 500);
        return next(error)
    }
    res.status(201);
    res.json(place);

};

const updatePlace = async ( req, res, next ) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors.errors);
        const error = new RequestError("Invalid Inputs", 422);
        return next(error)
    }
    
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId);
    } catch (e) {
        console.log(e)
        const error = new RequestError(
            `Could not find place ${placeId}`, 
            500
        );
        return next(error)
    }
    if(place.creator.toString() !== req.userData.userId){
        const error = new RequestError('Not Authorized', 401);
        return next(error);
    }
    if (!place){
        const error = new RequestError('place not found', 404);
        return next(error);
    }
    const { title, descripetion } = req.body;

    place.title = title || place.title;
    place.descripetion = descripetion || place.descripetion;
    try {
        await place.save();
    } catch (e) {
        console.log(e)
        const error = new RequestError(`Could not update place ${placeId}`, 500);
        return next(error);
    }

    res.status(201);
    res.json(place);
};

const deletePlace = async ( req, res, next ) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (e) {
        console.log(e)
        const error = new RequestError(`Could not find place ${placeId}`, 500)
        return next(error)
    };
    if(place.creator._id.toString() !== req.userData.userId){
        const error = new RequestError('Not Authorized', 401);
        return next(error);
    };
    if (!place){
        const error = new RequestError('place not found', 404)
        return next(error)
    }

    const imagePath = place.image

    try {
        const session = await mongoose.startSession();
        await session.startTransaction();
        await place.remove({ session: session });
        place.creator.places.pull(place);
        await place.creator.save();
        await session.commitTransaction()
    } catch (e) {
        console.log(e)
        const error = new RequestError(`Something went wrong, Could not Delete place ${placeId}`, 500)
        return next(error)
    }
    res.status(201);
    res.json({ message: "Place was deleted successfully!"});
    fs.unlink(imagePath, (e) => {
        console.log(e)
    })
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUser = getPlacesByUser;
exports.addPlace = addPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;