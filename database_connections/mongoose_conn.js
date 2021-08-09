const mongoose = require('mongoose');
const {URL} = require('../configurations/config_local');

mongoose.connect(URL, {useNewUrlParser: true}, { useUnifiedTopology: true })
const db = mongoose.connection;

module.exports = {db};