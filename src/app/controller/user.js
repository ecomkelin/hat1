const {DIR_UPLOAD} = require("../../config/const_sys");
const DSuser = require("../dbServer/user");
const resJson = require("../../resJson");
const fs = require('fs');
const path = require('path');

// post
exports.register = async(ctx, next) => {
    const position = "controller user register";
    try{
        const obj = ctx.request.body;

        const res = await DSuser.postUser(obj);
        return resJson.success(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
};

// get list
exports.list = async(ctx, next) => {
    const position = "controller user list";
    try{
        const paramObj = ctx.request.body;

        const res = await DSuser.getUserList(paramObj);
        return resJson.success(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}

// get info (auth with [code, pwd])
exports.login = async(ctx, next) => {
    const position = "controller user login";
    try{
        const {code, pwd} = ctx.request.body;

        const res = await DSuser.getUser({code, pwd});
        return resJson.success(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
};

// get info
exports.profile = async(ctx, next) => {
    const position = "controller user profile";
    try{
        const paramObj = ctx.request.body;

        const res = await DSuser.getUser(paramObj);
        return resJson.success(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}

// upload
exports.avatar = async(ctx, next) => {
    const position = "controller user avatar";
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
        


        const res = await DSuser.getUser();
        res.data.obj = obj;
        return resJson.success(ctx, res);
    } catch(err) {
        return resJson.errs(ctx, {position, err});
    }
}