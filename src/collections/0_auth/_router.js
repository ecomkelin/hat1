const router = require('@koa/router')();

// /* ============================= User Datebase ============================= */
// const UserModel = require("./User/Model");
// router.post("/b1/collection/User", ctx => ctx.body= { status: 200, doc: UserModel.doc } );	// 暴露给开发人员 User集合 的字段 field

// /* ============================= Customer Datebase ============================= */
// const CustomerModel = require("./Customer/Model");
// router.post("/b1/collection/Customer", ctx => ctx.body= { status: 200, doc: CustomerModel.doc } );	// 暴露给开发人员 Customer集合 的字段 field
const fs = require('fs');
const path = require('path');

const dataPath = path.join(process.cwd(), "src/collections/0_auth/");

fs.readdirSync(dataPath).forEach(dirName => {
    let dirPath = dataPath+dirName;
    let file = dirPath+"/Model.js";
    if(fs.existsSync(file)) {
        let routerItem = require(file);
        router.post("/b1/collection/"+dirName, ctx => ctx.body= { status: 200, doc: routerItem.doc } );
    }
})


module.exports = router;