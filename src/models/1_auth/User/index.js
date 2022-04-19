const docName = require("../../_doc/nameMap").User;
const doc = require("./doc");

const mongoc = require("../../js/mongoCommand")(docName, doc);

module.exports = mongoc