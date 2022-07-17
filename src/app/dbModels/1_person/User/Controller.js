const path = require('path');
const {format_phonePre} = require(path.resolve(process.cwd(), "bin/js/Format"));
const {controlPass_Pnull} = require(path.resolve(process.cwd(), "bin/js/db/filterControl"));
const {pwd_Pstr} = require("../FN_group");

const Model = require("./Model");

/**
 * 
 * @param {*} payload 权限
 * @param {*} docObj 创建对象
 * @returns 
 */

exports.createCT = (payload, docObj) => new Promise(async(resolve, reject) => {
    try{
        // 部分权限

        // is_change is_semiAuto 数据过滤控制
        let passObj = {pwd: docObj.pwd};
        if(docObj.phonePre) passObj.phonePre = docObj.phonePre;
        if(docObj.phone) passObj.phone = docObj.phone;
        await controlPass_Pnull(Model.doc, passObj);

        // is_change is_semiAuto 数据自动处理处;
        docObj.pwd = await pwd_Auto_Pstr(docObj.pwd);
        if(docObj.phoneNum) {
            docObj.phonePre = format_phonePre(docObj.phonePre);
            docObj.phone = docObj.phonePre+docObj.phoneNum;
        }

        // 写入
        let res = await Model.create_Pres(docObj);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});

exports.createManyCT = (payload, docObjs) =>  Promise(async(resolve, reject) => {
    try{
        let orgObjs = await Model.list_Pres({query: {}, projection: {code: 1}});
        // 写入
        let res = await Model.createMany_Pres(docObjs);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});

exports.modifyCT = (payload, docObj={}) => new Promise(async(resolve, reject) => {
    try{
        let match = {_id: docObj._id};
        // 还要加入 payload
        if(payload.Firm && payload.Firm._id) match.Firm = payload.Firm._id;
        if(payload.Shop && payload.Shop._id) match.Shop = payload.Shop._id;



        // is_change is_semiAuto 数据过滤控制
        let passObj = {};
        if(docObj.pwd) passObj.pwd = docObj.pwd;
        if(docObj.phonePre) passObj.phonePre = docObj.phonePre;
        if(docObj.phone) passObj.phone = docObj.phone;
        await controlPass_Pnull(Model.doc, passObj);

        // is_change is_semiAuto 数据自动处理处;
        if(docObj.pwd) docObj.pwd = await pwd_Auto_Pstr(docObj.pwd);
        if(docObj.phoneNum) {
            docObj.phonePre = format_phonePre(docObj.phonePre);
            docObj.phone = docObj.phonePre+docObj.phoneNum;
        }

        // 修改数据
        let res = await Model.modify_Pres(match, docObj);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});


exports.modifyManyCT = (payload, match, setObj) => new Promise(async(resolve, reject) => {
    try{
        let res = await Model.modifyMany_Pres(match, setObj);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});


exports.removeCT = (payload, body) => new Promise(async(resolve, reject) => {
    try{
        /* 读取数据 */
        let match = {_id: body._id};
        // match 还要加入 payload

        /* 判断数据 */
        let objOrg = await Model.findOne_Pobj({query: match, projection: {_id: 1}});
        if(!objOrg) return resolve({status: 400, message: "数据库中无此数据"});

        /* 删除数据 */
        let del = await Model.remove_Pres(match)
        return resolve(del);
    } catch(e) {
        return reject(e);
    }
});

exports.removeManyCT = (payload, match) => new Promise(async(resolve, reject) => {
    try{
        /* 删除数据 */
        let dels = await Model.removeMany_Pres(match)

        /* 返回 */
        return resolve({message: "删除成功"});
    } catch(e) {
        return reject(e);
    }
});















exports.detailCT = (payload, paramObj={}) => new Promise(async(resolve, reject) => {
    try{
        let {filter={}, select, populate} = paramObj;
        let {match={}} = filter;
        // 根据 payload 过滤 match select
        if(payload.Firm) match.Firm = payload.Firm;
        let res = await Model.detail_Pres(paramObj);
       return resolve(res);
    } catch(e) {
        return reject(e);
    }
});

exports.listCT = (payload, paramObj={}) => new Promise(async(resolve, reject) => {
    try{
        // 根据 payload 过滤 match select
        let res = await Model.list_Pres(paramObj);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});