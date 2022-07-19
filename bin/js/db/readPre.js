const {ObjectId} = global;
const {isObjectId} = require("../isType");

const readList = require("../../config/readList");
const readDetail = require("../../config/readDetail");
exports.listFilter_Pobj = (doc, paramList) => new Promise(async(resolve, reject) => {
    try {    
        let paramObj = await obtainFormat_Pobj(doc, paramList, readList);
        return resolve(paramObj);
    } catch(e) {
        return reject(e);
    }
});

exports.detailFilter_Pobj = (doc, paramDetail={}) => new Promise(async(resolve, reject) => {
    try {
        if(!isObjectId(paramDetail._id)) return resolve({status: 400, message: "请传递正确的id信息"});
        delete paramDetail.skip;
        delete paramDetail.limit;
        delete paramDetail.sort;

        let paramObj = await obtainFormat_Pobj(doc, paramDetail, readDetail);
        if(!paramObj.query) paramObj.query = {};
        paramObj.query._id = paramDetail._id;

        return resolve(paramObj);
    } catch(e) {
        return reject(e);
    }
})







const obt_docField = (doc, field) => {
    if(field === "_id") return {type: ObjectId};
    if(!doc) return null;
    if(doc[field]) return doc[field];
    let keys = field.split('.');
    if(keys.length !== 2) return null;
    let [key1, key2] = keys;
    if(!doc[key1]) return null;
    let fld = doc[key1];
    if(fld instanceof Object) {
        let fd = (fld instanceof Array) ? fld[0][key2] : fld[key2];
        if(fd) return fd;
    };
    return null;
}

const obtainFormat_Pobj = (doc, paramObj, readPreApi) => new Promise((resolve, reject) => {
    try {
        let paramTemp = {};
        let {filter, select={}, skip, limit, sort, populate} = paramObj;
    
        if(filter) {
            let matchObj = {"$or" : []};
            let {search, match, includes={}, excludes={}, lte={}, gte={}, at_before={}, at_after={}} = filter;
    
            if(search) {
                if(!search.fields) return reject({
                    status: 400,
                    message: "数据层 paramObj.filter.search 参数错误 需要传递 [search.fields] 参数",
                    readPreApi
                });
                search.keywords = String(search.keywords).replace(/(\s*$)/g, "").replace( /^\s*/, '');
                if(!search.keywords) {
                    search.fields = null;
                    search.keywords = null;
                } else {
                    let keywords = new RegExp(search.keywords + '.*');
                    search.fields  = (search.fields instanceof Array) ? search.fields : [search.fields];
                    for(i in search.fields) {
                        let field = search.fields[i];
                        let docField = obt_docField(doc, field);
                        if(!docField) return reject({
                            status: 400,
                            message: `[paramObj.filter.search.fields]: 数据库中无 此字段： [${field}] `,
                            readPreApi
                        });
                        if(docField.type !== String) return reject({
                            status: 400,
                            message: `数据层readPre [paramObj.filter.search.fields 的值 ${field}] 错误, 应该传递类型为<String>的<field>`,
                            readPreApi
                        });
                        matchObj["$or"].push({[field]: { $regex: keywords, $options: '$i' }});
                    }
                }
                paramTemp.search = search;
            }
            if(matchObj["$or"].length === 0) delete matchObj["$or"];
            for(key in match) {
                let docField = obt_docField(doc, key);
                if(!docField) continue;
                if(docField.type === ObjectId && !isObjectId(match[key]) ) return reject({
                    status: 400,
                    message: `数据层readPre [paramObj.filter.match.${key}] 类型为 ObjectId, 请您检查`,
                    readPreApi
                });
                matchObj[key] = match[key];
            }
            for(key in includes) {
                let docField = obt_docField(doc, key);
                if(!docField) continue;
                if(docField.type === ObjectId && !isObjectId(includes[key]) ) return reject({
                    status: 400,
                    message: `[paramObj.filter.includes.${key}] 类型为 ObjectId`,
                    readPreApi
                });
                matchObj[key] = {"$in": includes[key]};
            }
            for(key in excludes) {
                let docField = obt_docField(doc, key);
                if(!docField) continue;
                if(docField.type === ObjectId && !isObjectId(excludes[key]) ) return reject({
                    status: 400,
                    message: `[paramObj.filter.excludes.${key}] 类型为 ObjectId`,
                    readPreApi
                });
                matchObj[key] = {"$nin": excludes[key]};
            }
            for(key in lte) {
                let docField = obt_docField(doc, key);
                if(!docField) continue;
                if(docField.type !==  Number) return reject({
                    status: 400,
                    message: `[paramObj.filter.lte 的 key ${key}] 必须为Number类型`,
                    readPreApi
                });
                matchObj[key] = {"$lte": lte[key]};
            }
        
            for(key in gte) {
                let docField = obt_docField(doc, key);
                if(!docField) continue;
                if(docField.type !==  Number) return reject({
                    status: 400,
                    message: `[paramObj.filter.gte 的 key ${key}] 必须为Number类型`,
                    readPreApi
                });
                
                matchObj[key] = {"$gte": gte[key]};
            }
            for(key in at_before) {
                let docField = obt_docField(doc, key);
                if(!docField) continue;
                if(docField.type !==  Date) return reject({
                    status: 400,
                    message: `[paramObj.filter.at_before 的 key ${key}] 必须为 Date 类型`,
                    readPreApi
                });
                let before = (new Date(at_before[key]).setHours(23,59,59,999));
                matchObj[key] = {"$lte": before};
            }
            for(key in at_after) {
                let docField = obt_docField(doc, key);
                if(!docField) continue;
                if(docField.type !==  Date) return reject({
                    status: 400,
                    message: `[paramObj.filter.at_after 的 key ${key}] 必须为 Date 类型`,
                    readPreApi
                });
                let after = (new Date(at_after[key]).setHours(0,0,0,0));
                matchObj[key] = {"$gte": after};
            }
            paramTemp.query = matchObj;
        }
    
        if(skip) {
            if(isNaN(skip) || skip < 0) {
                if(docField.type !==  Date) return reject({
                    status: 400,
                    message: `[paramObj.skip] 必须为大于0的 Number 类型`,
                    readPreApi
                });
            }
            paramTemp.skip = skip;
        }
    
        paramTemp.limit = 0; // 在此只判断数值
        if(limit) {
            if(isNaN(limit) || limit < 0) {
                return reject({
                    status: 400,
                    message: `[paramObj.limit] 必须为大于0的 Number 类型`,
                    readPreApi
                });
            }
            paramTemp.limit = limit;
        } 
    
        for(key in select) {
            let docField = obt_docField(doc, key);
            if(!docField) return reject({
                status: 400,
                message: `[paramObj.select 的 ${key}] 不是该数据的字段`,
                readPreApi
            });

            if(docField.is_hideRead) {
                delete select[key];
            } else {
                if(select[key] != 1) {
                    select[select[key]] = "$"+key;
                    delete select[key];
                }
            }
        }
        for(key in doc) {
            if(doc[key].is_hideRead) delete select[key];
        }
        paramTemp.projection = select;
    
        if(sort) {
            for(key in sort) {
                if(!obt_docField(doc, key)) return reject({
                    status: 400,
                    message: `[paramObj.sort 的 ${key}] 不是该数据的字段`,
                    readPreApi
                });
                if(sort[key] !== -1 && sort[key] !== "-1") {
                    sort[key] = 1
                }
            }
            paramTemp.sort = sort;
        }
    
        if(populate) {
            if((typeof populate) === 'string') {
    
            } else if(populate instanceof Array) {
                
            } else if(populate instanceof Object) {
    
            } else {
                return reject({
                    status: 400,
                    message: `[paramObj.populate] 参数错误`,
                    readPreApi
                });
            }
            paramTemp.populate = populate;
        }
        return resolve(paramTemp);
    } catch(e) {
        return reject(e);
    }
})