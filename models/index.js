const dbConfig = require('../config/db.config');

const mongoose = require('mongoose');

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;

db.user = require('./users.js')(mongoose);
db.activity = require('./activities.js')(mongoose);

module.exports = db;
