const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const dbSchema = new Schema({
    code: String,
    name: String,
    phonePre: String,
    phoneNum: String,
    phone: String,
    pwd: String
});

module.exports = mongoose.model('k2_user_DB', dbSchema);