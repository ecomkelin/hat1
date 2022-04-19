const mongoose = require('mongoose');

exports.db_master = mongoose.createConnection(process.env.DB_MASTER, { useNewUrlParser: true, useUnifiedTopology: true});
// exports.db_slave1 = mongoose.createConnection(process.env.DB_SLAVE1, { useNewUrlParser: true, useUnifiedTopology: true});
