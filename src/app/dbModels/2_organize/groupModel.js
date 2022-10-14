/**
 * @description: 
 */

const doc_global = require("../globalModel");
module.exports = {
    // 登录信息
    ...doc_global,

    contacts: [{
        tel: {type: String}, 
        mail: {type: String},
    }],

    addr: {
        City: {type: String},
        name: {type: String},
        road: {type: String},
        postcode: {type: String},
        note: {type: String},
   },
}