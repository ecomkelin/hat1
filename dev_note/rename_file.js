
const multer = require("@koa/multer");
const fs = require("fs");
const dir_upload = path.join(process.cwd(), 'upload/');
// const dd = dir_upload+'2000'+"a"

const upload = multer({
    // 设置文件的存储位置
    destination: (req, file, cb) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const dir = dir_upload+year+month+day;
        if(!fs.existsSync(dir)) {
            fs.mkdirSync(dir, {
                recursive: true
            })
        }
        cb(null, dir); // 把文件上传到目录
    },
    // 文件的存储名称
    filename: (req, file, cb) => {
        const filename = 'name' + '-' + Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
})
router.post("/avatar", upload.single('myfile'), async(ctx, next) => {
    ctx.body = {
        data: ctx.req.file
    }

});