const mongoose = require('mongoose');

mongoose.Promise = Promise;
const db = mongoose.createConnection('mongodb://localhost:27017/acl');

db.model('posts', new mongoose.Schema({ name: String, userId: String, usersIds: [String] }));
db.model('users', new mongoose.Schema({ name: String }));

module.exports = db;
