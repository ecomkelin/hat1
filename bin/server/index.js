const path = require('path');
require('dotenv').config();
require("../config/env");

const {SERVER_NAME, SERVER_PORT, IS_PRD, IS_DEV} = global;
const koaServer = require("./koaServer");

if(IS_PRD) {
    console.log = () => {};
    console.debug = () => {};
} else if(IS_DEV) {
    console.debug = () => {};
}

koaServer.listen(SERVER_PORT, () => {
    console.info(`[ ============== ${SERVER_NAME} Start on: http://localhost:${SERVER_PORT} ============== ]`);
});