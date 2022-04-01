const path = require('path');

module.exports = {
    SERVER_PORT: 8000,
    DB_SERVER: "mongodb://localhost/hat1",

    DIR_ROOT: process.cwd(),
    DIR_PUBLIC: path.join(process.cwd(), "public/"),
    DIR_UPLOAD: path.join(process.cwd(), "public/upload/"),
}