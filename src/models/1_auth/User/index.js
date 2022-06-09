const path = require('path');

const doc = require("./doc");
const docName = require("../../_doc/collections").User;

const Model = require(path.join(process.cwd(), "bin/sql/mongodb"))(docName, doc);

module.exports = Model