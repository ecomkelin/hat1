const router = require('@koa/router')({prefix: '/Users'});

const path = require('path');
const {doc} = require(path.resolve(process.cwd(), "src/models/User"));

const Contrroller = require("./controller");
const preCT = require("../../middle/preCT");

router.post("/", preCT.list(doc), Contrroller.list);
router.post("/detail/:id", preCT.detail(doc), Contrroller.detail);

router.post("/create", preCT.create(doc), Contrroller.create);
router.post("/delete/:id", preCT.delete(doc), Contrroller.delete);
router.post("/modify/:id", preCT.modify(doc), Contrroller.modify);

module.exports = router;