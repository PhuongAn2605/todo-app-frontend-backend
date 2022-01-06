const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();


const bodyParser = require('body-parser');

const HttpError = require('./models/http-error');
const todoRoutes = require('./routes/todo-routes');

const MONGO_URL = `mongodb://${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`;

const app = express();

let db;
let user;

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT");
  
    next();
  });

app.use('/api/todo-item', todoRoutes);

app.use((req, res, next ) => {
    const error = new HttpError('Could not find this route', 404);
    throw error;
});

mongoose.connect(MONGO_URL).then(() => {
    app.listen(process.env.PORT || 5000 );
}).then(() => {
    console.log('Connected to db!')
}).catch((err) => {
    console.log(err);
})