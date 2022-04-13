const router = require('@koa/router')();

const path = require('path');
const {doc} = require(path.resolve(process.cwd(), "src/models/User"));

const Contrroller = require("./User");
const preCT = require(path.resolve(process.cwd(), "middle/preCT"));

router.post("/User/list", preCT.list(doc), Contrroller.list);
router.post("/User/detail/:id", preCT.detail(doc), Contrroller.detail);

router.post("/User/create", preCT.create(doc), Contrroller.create);
router.post("/User/delete/:id", preCT.delete(doc), Contrroller.delete);
router.post("/User/modify/:id", preCT.modify(doc), Contrroller.modify);

module.exports = router;