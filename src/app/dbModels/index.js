/* 数据库中 集合映射的名字 */
/*
// module.exports = {
// 	// auth
// 	"Customer": "hat_Customer_dbs",
// 	"Supplier": "hat_Supplier_dbs",
// 	"User": "hat_User_dbs",

// 	"Role": "hat_Role_dbs",

// 	"Firm": "hat_Firm_dbs",
// 	"City": "hat_City_dbs",
// }
*/

const fs = require('fs');
const MdPath = path.join(process.cwd(), "src/app/dbModels/");
const docNameObj = {};

const getModelName = (dirPath, paths, n, inFiles) => {
    fs.readdirSync(dirPath).forEach(dirName => {
        if(dirName.split('.').length === 1) {       // 如果是文件夹 则进一步读取内容
            paths[n+1] = dirName;
            getModelName(path.join(dirPath+dirName+'/'), paths, n+1, inFiles);
        } else {                                    // 如果是文件则 则加载
            if(inFiles.includes(dirName)) {
                let file = dirPath+ dirName;
                if(fs.existsSync(file)) {
                    let routerName = paths[n];
                    docNameObj[routerName] = "hat_"+routerName+"_dbs";
                }
            }
        }
    });
}

getModelName(MdPath, ['dbModels'], 0, ['Model.js'])
module.exports = docNameObj;