const path = require('path');

module.exports = {
    SERVER_PORT: 8000,
    DB_SERVER1: "mongodb://localhost/hat1",
    // DB_SERVER1: "mongodb+srv://kelin:Ag3sUKbjTDcjD5Et@h1.nxwyu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    // DB_SERVER2: "mongodb+srv://kelin:Ag3sUKbjTDcjD5Et@h2.h9nx0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    // DB_SERVER2: "mongodb://localhost/hat2",

    DIR_ROOT: process.cwd(),
    DIR_API: path.resolve(process.cwd(), "api/"),
    DIR_PUBLIC: path.resolve(process.cwd(), "public/"),
    DIR_UPLOAD: path.resolve(process.cwd(), "public/upload/"),
}