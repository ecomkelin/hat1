require("./bin/env");


const koaServer = require("./bin/server/koaServer");

koaServer.listen(SERVER_PORT, () => {
    console.info(`[ ======= ${SERVER_NAME} Start on: http://localhost:${SERVER_PORT} ======= ]`);
});