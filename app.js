const express = require('express');
const morgan = require('morgan');
const {PORT} = require('./configurations/config_local');
const {db} = require('./database_connections/mongoose_conn');

const app = express();
const teachers = require('./Routes/teachers');

db.on('error', (err) => console.error(err));
db.once('open', () => console.log('connected to database'));

app.use(morgan('dev'));
app.use(express.json());
app.use('/teachers', teachers);

app.use((req, res, next)=>{
    const err = new Error('Not found');
    err.status = 404;
    next(err)
})

app.use((error, req, res)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
})

app.listen(PORT, () => console.log(`server listening on port ${PORT}`))