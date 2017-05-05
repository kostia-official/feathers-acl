const mongoose = require('mongoose');

mongoose.Promise = Promise;
const db = mongoose.createConnection('mongodb://localhost:27017/acl');

const schema = new mongoose.Schema({ name: String, userId: String });
db.model('posts', schema);

module.exports = db;
