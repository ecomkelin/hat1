/**
 * 环境变量文件
 */

require('dotenv').config();

/* =============== 常用变量 path ================== */
path = require('path');


const fs = require('fs');
const getEnvs = (dirPath) => {
    fs.readdirSync(dirPath).forEach(dirName => {
        let fns = dirName.split('.');
        if(fns.length === 1) {       // 如果是文件夹 则进一步读取内容
            getEnvs(path.join(dirPath+dirName+'/'));
        } else if(fns.length === 3) { // 如果有两个点的文件 则加载
            if(fns[1] === "env" && fns[2] === "js") {   // 加载文件名的规则是 ***.router.js
                let file = dirPath+ dirName;
                if(fs.existsSync(file)) {
                    require(file);
                }
            }
        }
    });
}
(() => {
    let dirPath = path.join(process.cwd(), "bin/env/");
    getEnvs(dirPath);
})()

/* ======================================== 缓存信息 ======================================== */
is_cache_Role=false;