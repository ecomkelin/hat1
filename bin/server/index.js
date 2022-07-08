const path = require('path');
const {SERVER_NAME, SERVER_PORT, IS_PRD} = require(path.resolve(process.cwd(), "bin/config/env"));
const koaServer = require("./koaServer");

if(IS_PRD) console.log = () => {};

koaServer.listen(SERVER_PORT, () => {
    console.info(`[ ============== ${SERVER_NAME} Start on: http://localhost:${SERVER_PORT} ============== ]`);
});