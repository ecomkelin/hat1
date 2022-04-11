const {
    conn1,
    // conn2
} = require("../_connDBs");

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const docName = require("../_docName");

const doc = {
    code: String,
    name: String,
    desp: String,

    type: String,
    url: String
};

const model1 = conn1.model(docName.User, new Schema(doc));
// const model2 = conn2.model(docName.User, new Schema(doc));

module.exports = {
    model1,
    // model2,
    doc,
};