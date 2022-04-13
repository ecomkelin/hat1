const mongoose = require('mongoose');

const {
    DB_SERVER1,
    // DB_SERVER2
} = require("./_sysConf");


exports.conn1 = mongoose.createConnection(DB_SERVER1, { useNewUrlParser: true, useUnifiedTopology: true});
// exports.conn2 = mongoose.createConnection(DB_SERVER2, { useNewUrlParser: true, useUnifiedTopology: true});
