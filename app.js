const express = require('express');
const app = express();
const mongoose = require('mongoose');
const teachers = require('./teachers');

mongoose.connect('mongodb://localhost/teachers', {useNewUrlParser: true})
const db = mongoose.connection;
db.on('error', (err) => console.error(err))
db.on('open', () => console.log('connected to database'))

app.use(express.json());
app.use('/teachers', teachers);

app.listen(5000, () => console.log('server listening on port 5000'))