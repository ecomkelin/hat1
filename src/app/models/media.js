const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dbSchema = new Schema({
    code: String,
    name: String,
    desp: String,

    type: String,
    url: String
});

module.exports = mongoose.model('k2_image_DB', dbSchema);