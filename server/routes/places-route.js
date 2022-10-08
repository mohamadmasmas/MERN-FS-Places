const express = require('express');
const { check } = require('express-validator');
const Places = require('../controllers/places-controller');
const fileUpload = require('../middleware/file-upload');
const auth = require('../middleware/auth')

const router = express.Router();

router.get('/users/:uid', Places.getPlacesByUser );

router.get('/:pid', Places.getPlaceById);

router.use(auth);

router.post(
    '/', fileUpload.single('image'), 
    [
    check('title')
        .not()
        .isEmpty(),
    check('descripetion')
        .isLength({min:5}),
    check('address')
        .not()
        .isEmpty()
    ],
    Places.addPlace
);

router.patch('/:pid',
    [
    check('title')
        .not()
        .isEmpty(),
    check('descripetion')
        .isLength({min:5})
    ], Places.updatePlace);

router.delete('/:pid', Places.deletePlace);

module.exports = router