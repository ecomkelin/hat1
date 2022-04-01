const server = require("./server");

const {SERVER_PORT} = require("./config/const_sys");

server.listen(SERVER_PORT, () => {
    console.log(`server is running on http://localhost:${SERVER_PORT}`);
});