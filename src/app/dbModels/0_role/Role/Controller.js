const path = require('path');
const {IS_DEV} = require(path.resolve(process.cwd(), "bin/config/env"));

const Model = require("./Model");
/**
 * @param {*} payload 权限
 * @param {*} docObj 创建对象
 * @returns 
 */
exports.removeAllCT = (payload, docObj) => new Promise(async(resolve, reject) => {
    try{
        if(!IS_DEV) return reject({status: 400, message: "只有 开发状态 才可以使用此功能"});
        /* 删除数据 */
        let dels = await Model.removeMany_Pres({})

        /* 返回 */
        return resolve(dels);
    } catch(e) {
        return reject(e);
    }
});



exports.createCT = (payload, docObj) => new Promise(async(resolve, reject) => {
    try{

        // 写入
        let res = await Model.create_Pres(docObj);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});

exports.createManyCT = (payload, docObjs) => new Promise(async(resolve, reject) => {
    try{
        // let Orgs = await Model.list_Pres({query: {}, projection: {code: 1}});
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
        // match里面要加入 payload 限制信息
        if(payload.Firm && payload.Firm._id) match.Firm = payload.Firm._id; // 如果是公司用户 则只可修改本公司的用户
        if(payload.Shop && payload.Shop._id) match.Shop = payload.Shop._id; // 如果是分店用户 则只可修改本分店的用户

        // 修改数据
        let res = await Model.modify_Pres(match, docObj);
        return resolve(res);
    } catch(e) {
        return reject(e);
    }
});


exports.modifyManyCT = (payload, match, update) => new Promise(async(resolve, reject) => {
    try{
        let res = await Model.modifyMany_Pres(match, update);
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
        return resolve(dels);
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