const RequestError = require('../models/http-error');
const { validationResult } = require('express-validator');
const uuid = require('uuid');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const getUsers = async ( req, res, next ) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch (e) {
        console.log(e);
        const error = new RequestError('Fetching users failed please try again!', 500)
        return next(error);
    }
    if (users.length == 0){
        const error = new RequestError('There is no users yet', 400)
        return next(error)
    }
    
    res.status(200);
    res.json(users);
};

const getUserById = async ( req, res, next ) => {

    const userId = req.params.uid;
    let user;
    try {
        user = await User.findById(userId);
        
    } catch (e){
        console.log(e)
        const error = new RequestError('Something went wrong!', 500)
        return next(error)
    }
    if (!user){
        const error = new RequestError('user not found', 404)
        return next(error)
    }
    res.status(200);
    res.json(user);
};

const addUser = async ( req, res, next ) => {
   
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors.errors);
        
        const error = new RequestError("Invalid Inputs", 422);
        
        return next(error)
    }
    
    const { name, email, password } = req.body;
    let userExist
    try {
        userExist = await User.findOne({ email: email });   
        if (userExist){
            const error = new RequestError('email already exists!', 422)
            return next(error)
        }
    } catch (e) {
        console.log(e)
        const error = new RequestError('sign up failed please try again!', 500)
        return next(error)
    }
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (e) {
        console.log(e)
        const error = new RequestError('sign up failed please try again!', 500)
        return next(error)
    }
    
    const user = new User({
        _id: uuid.v4().split('-').join("").substring(0,24),
        name,
        email,
        image: req.file.path,
        password: hashedPassword,
        places: []
    })
    try {
        await user.save()
    } catch (e) {
        console.log(e)
        const error = new RequestError('could not Create User', 404)
        return next(error)
    }

    let token;
    try {
        token = jwt.sign(
            { userId: user.id, email: user.email}, 
            "my_secret", 
            { expiresIn: '2h'})
    } catch (e) {
        console.log(e)
        const error = new RequestError('Some thing went wrong!', 500)
        return next(error)
    }
    

    res.status(201);
    res.json({
        userId: user._id,
        name: user.name,
        email: user.email,
        token: token
    });
};

const login = async ( req, res, next ) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        console.log(errors.errors);
        
        const error = new RequestError("Invalid Inputs", 422);
        
        return next(error)
    };

    const {  email, password } = req.body;
    let userExist
    try {
        userExist = await User.findOne({ email: email });   
        if (!userExist){
            const error = new RequestError('Invalid credentials!', 401);
            return next(error);
        }
    } catch (e) {
        console.log(e)
        const error = new RequestError('login failed please try again!', 500)
        return next(error)
    };
    let isValidPassword;
    try {
        isValidPassword = await bcrypt.compare(password, userExist.password);
        if (!isValidPassword){
            const error = new RequestError('Invalid credentials!', 401);
            return next(error);
        }
    } catch (e) {
        console.log(e)
        const error = new RequestError('login failed please try again!', 500)
        return next(error)
    };
    let token;
    try {
        token = jwt.sign(
            { userId: userExist.id, email: userExist.email}, 
            "my_secret", 
            { expiresIn: '2h'})
    } catch (e) {
        console.log(e)
        const error = new RequestError('Some thing went wrong!', 500)
        return next(error)
    }
    

    res.status(201);
    res.json({
        userId: userExist._id,
        name: userExist.name,
        email: userExist.email,
        token: token
    });
};

// const updateUser = ( req, res, next ) => {

//     const { name, email } = req.body;
//     const placeId = req.params.pid;

//     const place = DUMMY_PLACES.find((place) => {

//         if(place.id === placeId){
//             place.title = title || place.title,
//             place.descripetion = descripetion || place.descripetion
//             console.log(place)
//             return place
//         }
//     })

//     res.status(201);
//     res.json(place);
// };

const deleteUser = ( req, res, next ) => {

    const userId = req.params.uid;

    const newUsers = DUMMY_USERS.filter((user) => {

        return user.id !== userId
    });

    DUMMY_USERS = newUsers

    res.status(201);
    res.json(newUsers);
};

exports.getUserById = getUserById;
exports.getUsers = getUsers;
exports.addUser = addUser;
exports.login = login;
// exports.updateUser = updateUlace;
exports.deleteUser = deleteUser;