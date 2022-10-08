const fs = require('fs');
const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const RequestError = require('./models/http-error');
const mongoose = require('mongoose');

// Routes
const placesRoutes = require('./routes/places-route');
const usersRoutes = require('./routes/users-route')

const app = express();

// MiddleWare
app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads','images')))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next()
})

app.use( '/api/places' ,placesRoutes);

app.use( '/api/users' ,usersRoutes);

app.use(( req, res, next) => {
    const error = new RequestError('This Route does not exist', 404)
    
    throw error
});

// This middleware for errors
app.use((error, req, res, next) => {
    if(req.file){
        fs.unlink(req.file.path, (e) => {
            console.log(e)
        })
    }
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || "Unkown error ocured"});
});

mongoose.connect(`mongodb+srv://masmasmohamad:test123@placescluster.zxtjjg4.mongodb.net/places?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Connected to DB...')
        app.listen(5000);
    })
    .catch(e => {
        console.log(e)
    });

