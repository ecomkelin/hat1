require('dotenv').config();
const port = process.env.SERVER_PORT;
const koaServer = require("./koaServer")

koaServer.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
});