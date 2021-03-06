const {ObjectId} = global;
const {isObjectId} = require("../isType");

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
const setProject = (doc, param, select={}) => {
    let message = null;
    for(key in select) {
        let docField = obt_docField(doc, key);
        if(!docField) {
            message = `[paramObj.select 的 ${key}] 不是该数据的字段`;
            break;
        }

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
    param.projection = select;
}
const setPopulate = (doc, param, populate) => {
    if((typeof populate) === 'string') {
    
    } else if(populate instanceof Array) {
        
    } else if(populate instanceof Object) {

    } else {
        return reject({
            status: 400,
            message: `[paramObj.populate] 参数错误`,
        });
    }
    param.populate = populate;
}
exports.readMany = (doc, paramObj) => new Promise((resolve, reject) => {
    try {
        let param = {};
        let {filter, select={}, skip, limit, sort, populate} = paramObj;
        if(filter) {
            let matchObj = paramObj.match || {};
            if(!matchObj["$or"]) matchObj["$or"] = [];
            let {search, match, includes={}, excludes={}, lte={}, gte={}, at_before={}, at_after={}} = filter;
            if(search) {
                if(!search.fields) return reject({
                    status: 400,
                    message: "数据层 paramObj.filter.search 参数错误 需要传递 [search.fields] 参数",
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
                        });
                        if(docField.type !== String) return reject({
                            status: 400,
                            message: `数据层readPre [paramObj.filter.search.fields 的值 ${field}] 错误, 应该传递类型为<String>的<field>`,
                        });
                        matchObj["$or"].push({[field]: { $regex: keywords, $options: '$i' }});
                    }
                }
                param.search = search;
            }
            if(matchObj["$or"].length === 0) delete matchObj["$or"];
            for(key in match) {
                let docField = obt_docField(doc, key);
                if(!docField) continue;
                if(docField.type === ObjectId && !isObjectId(match[key]) ) return reject({
                    status: 400,
                    message: `数据层readPre [paramObj.filter.match.${key}] 类型为 ObjectId, 请您检查`,
                });
                matchObj[key] = match[key];
            }
            for(key in includes) {
                let docField = obt_docField(doc, key);
                if(!docField) continue;
                if(docField.type === ObjectId ) {
                    let vals = includes[key];
                    for(let i=0; i<vals.length; i++) {
                        if(!isObjectId(vals[i])) return reject({
                            status: 400,
                            message: `[paramObj.filter.includes.${key}] 类型为 ObjectId`,
                        });
                    }
                }
                matchObj[key] = {"$in": includes[key]};
            }
            for(key in excludes) {
                let docField = obt_docField(doc, key);
                if(!docField) continue;
                if(docField.type === ObjectId && !isObjectId(excludes[key]) ) return reject({
                    status: 400,
                    message: `[paramObj.filter.excludes.${key}] 类型为 ObjectId`,
                });
                matchObj[key] = {"$nin": excludes[key]};
            }
            for(key in lte) {
                let docField = obt_docField(doc, key);
                if(!docField) continue;
                if(docField.type !==  Number) return reject({
                    status: 400,
                    message: `[paramObj.filter.lte 的 key ${key}] 必须为Number类型`,
                });
                matchObj[key] = {"$lte": lte[key]};
            }
        
            for(key in gte) {
                let docField = obt_docField(doc, key);
                if(!docField) continue;
                if(docField.type !==  Number) return reject({
                    status: 400,
                    message: `[paramObj.filter.gte 的 key ${key}] 必须为Number类型`,
                });
                
                matchObj[key] = {"$gte": gte[key]};
            }
            for(key in at_before) {
                let docField = obt_docField(doc, key);
                if(!docField) continue;
                if(docField.type !==  Date) return reject({
                    status: 400,
                    message: `[paramObj.filter.at_before 的 key ${key}] 必须为 Date 类型`,
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
                });
                let after = (new Date(at_after[key]).setHours(0,0,0,0));
                matchObj[key] = {"$gte": after};
            }
            param.match = matchObj;
        }

        let message = null;
        message = setProject(doc, param, select);
        if(message) return reject({status: 400, message});

        if(skip) {
            if(isNaN(skip) || skip < 0) {
                if(docField.type !==  Date) return reject({
                    status: 400,
                    message: `[paramObj.skip] 必须为大于0的 Number 类型`,
                });
            }
            param.skip = skip;
        }
    
        if(limit) {
            if(isNaN(limit) || limit < 0) {
                return reject({
                    status: 400,
                    message: `[paramObj.limit] 必须为大于0的 Number 类型`,
                });
            }
            param.limit = limit;
        } 
    
        if(sort) {
            for(key in sort) {
                if(!obt_docField(doc, key)) return reject({
                    status: 400,
                    message: `[paramObj.sort 的 ${key}] 不是该数据的字段`,
                });
                if(sort[key] !== -1 && sort[key] !== "-1") {
                    sort[key] = 1
                }
            }
            param.sort = sort;
        }
    
        if(populate) {
            message = setProject(doc, param, select);
            if(message) return reject({status: 400, message});
        }

        return resolve(param);
    } catch(e) {
        return reject(e);
    }
})


exports.readOne = (doc, paramObj) => new Promise(async(resolve, reject) => {
    try {
        let param = {};
        let {match={}, select, populate} = paramObj;
        if(!match._id) return reject({status: 400, message: "查找detail数据时 请输入数据的 _id"});
        param.match = paramObj.match;

        let message = null;

        message = setProject(doc, param, select);
        if(message) return reject({status: 400, message});

        if(populate) {
            message = setProject(doc, param, select);
            if(message) return reject({status: 400, message});
        }

        return resolve(param);
    } catch(e) {
        return reject(e);
    }
});