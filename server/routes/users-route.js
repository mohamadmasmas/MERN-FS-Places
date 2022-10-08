const express = require('express');
const { check } = require('express-validator');
const Users = require('../controllers/users-controller');

const fileUpload = require('../middleware/file-upload');

const router = express.Router();

router.get('/', Users.getUsers);

router.get('/:uid', Users.getUserById );

router.post('/login',
    check('email')
    .normalizeEmail()
    .isEmail(), 
Users.login);

router.post('/sign-up',
    fileUpload.single('image'),
    [
    check('name')
        .not()
        .isEmpty(),
    check('password')
        .isLength({min:6}),
    check('email')
        .normalizeEmail()
        .isEmail()
    ], Users.addUser);

// router.patch('/:pid', Users.updateUser);

router.delete('/:uid', Users.deleteUser);

module.exports = router