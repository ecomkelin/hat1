const {SERVER_PORT} = require("./_sysConf");
const server = require("./server")

server.listen(SERVER_PORT, () => {
    console.log(`server is running on http://localhost:${SERVER_PORT}`);
});