const request = require('supertest');
// const server = require("../bin/server/koaServer");
const server = require("../bin/server/koaServer").callback();
module.exports = request(server);