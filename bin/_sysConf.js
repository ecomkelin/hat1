const path = require('path');

module.exports = {
    SERVER_PORT: 8000,

    DIR_PUBLIC: path.resolve(process.cwd(), "public/"),
    DIR_UPLOAD: path.resolve(process.cwd(), "public/upload/"),

    LIMIT_FIND: 50,     
}