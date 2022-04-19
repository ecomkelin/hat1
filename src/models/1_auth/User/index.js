const docName = require("../../_doc/collections").User;
const doc = require("./doc");

const mongoc = require("../../js/mongoCommand")(docName, doc);

module.exports = mongoc