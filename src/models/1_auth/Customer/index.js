const docName = require("../../_doc/collections").Customer;
const doc = require("./doc");

const mongoc = require("../../js/mongoCommand")(docName, doc);

module.exports = mongoc