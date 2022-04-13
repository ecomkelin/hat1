const resJson = require("../../resJson");
const fs = require('fs');
const path = require('path');

// upload
exports.upload = async(ctx, next) => {
    const position = "controller Media upload";
    try{
        const files = ctx.request.files;
        const obj = ctx.request.body.obj;

        // if(file) {
        //     const date = new Date();
        //     const year = date.getFullYear();
        //     const month = date.getMonth();
        //     const day = date.getDate();
        //     const dir = DIR_UPLOAD+year+month+day;
        //     if(!fs.existsSync(dir)) {
        //         fs.mkdirSync(dir, {
        //             recursive: true
        //         })
        //     }
        //     // 文件的存储名称

        //     const filename = 'name' + '-' + Date.now() + path.extname(file.path);
        //     console.log(filename)
        // }
        
        const result = {
            message: "上传成功1",
            data: {
                obj,
                files
            }
        };
        return resJson.success(ctx, result);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}