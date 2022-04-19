const docName = require("../../_doc/nameMap").Customer;
const doc = require("./doc");

const mongoc = require("../../js/mongoCommand")(docName, doc);

module.exports = mongoc