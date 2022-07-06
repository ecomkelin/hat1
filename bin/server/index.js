require('dotenv').config();
const port = process.env.SERVER_PORT;
const koaServer = require("./koaServer");

if(process.env.NODE_ENV === 'production') console.log = () => {}

koaServer.listen(port, () => {
    console.info(`server is running on http://localhost:${port}`);
});