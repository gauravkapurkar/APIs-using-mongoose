const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const teachers = require('./Routes/teachers');

mongoose.connect('mongodb://localhost/teachers', {useNewUrlParser: true})
const db = mongoose.connection;
db.on('error', (err) => console.error(err))
db.once('open', () => console.log('connected to database'))

app.use(morgan('dev'));
app.use(express.json());
app.use('/teachers', teachers);

app.use((req, res, next)=>{
    const err = new Error('Not found');
    err.status = 404;
    next(err)
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
})

app.listen(9000, () => console.log('server listening on port 9000'))