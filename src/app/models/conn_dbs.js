const mongoose = require('mongoose');
const path = require('path');

const {
    DB_SERVER1,
    // DB_SERVER2
} = require(path.resolve(process.cwd(), "src/config/const_sys"));


exports.conn1 = mongoose.createConnection(DB_SERVER1, { useNewUrlParser: true, useUnifiedTopology: true});
// exports.conn2 = mongoose.createConnection(DB_SERVER2, { useNewUrlParser: true, useUnifiedTopology: true});
