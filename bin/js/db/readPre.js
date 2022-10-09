/**
 * 获取 doc模型中 field 对象
 * @param {required, Object} doc 
 * @param {required, String} field 
 * @returns 
 */
const obt_docFieldObj = (doc, field) => {
    if(!doc) return {errMsg: " obt_docFieldObj 中的 doc不能为空"};   // 如果没有doc则返回空
    if(!field) return {errMsg: " obt_fieldFieldObj 中的 field不能为空"};   // 如果没有doc则返回空

    if(field === "_id") return {type: ObjectId};  // 如果 field 是 _id 则返回 ObjectId类型

    if(doc[field]) return doc[field];   // 如果存在此 filed 直接返回

    /** field 中有可能包含点('.')  */
    let keys = field.split('.');
    if(keys.length < 2) return {errMsg: "doc中 无此对象"};  // 如果 field 不包含点('.') 已经判定无此对象

    /** 有可能为多级对象  */
    let [key1, key2] = keys;
    if(!doc[key1]) return {errMsg: "doc中 无此对象"}; // 如果第一层没有 则返回空
    let fld = doc[key1];
    if(fld instanceof Object) { // 判断 doc[key1]是否为对象 如果不为对象则跳过 返回空
        let fd = (fld instanceof Array) ? fld[0][key2] : fld[key2]; // 判断doc[key1]是否为数组 获取下一层
        if(fd) return fd;
        return {errMsg: `doc[${key1}] 中没有 ${key2} 这个对象`}
    };
    return {errMsg: `doc[${key1}] 不是对象`};  // 如果 doc[key1] 不是对象 则错误
}

/**
 * 
 * @param {*} doc 
 * @param {*} param 
 * @param {*} select 
 */
const setProject = (doc, param, select={}) => {
    for(key in select) {
        let docField = obt_docFieldObj(doc, key);
        if(docField.errMsg) return `[paramObj.select 的 ${key}] 不是该数据的字段`+docField.errMsg;

        if(docField.is_UnReadable) { // 如果 字段不可读 则直接从读取数据中删除 比如pwd
            if(IS_STRICT) {
                if(select[key] == 1) return `[paramObj.select 的 ${key}] 不能显示`;
            } else {
                delete select[key];
            }
        } else {
            if(select[key] != 1) {  // 如果不为1 则为变更 字段名称
                select[select[key]] = "$"+key;
                delete select[key];
            }
        }
    }

    for(key in doc) {   // 如果没有select 则需要自动去掉不可读的数据
        if(doc[key].is_UnReadable) delete select[key];
    }
    param.projection = select;
}
const setPopulate = (doc, param, populate) => {
    if((typeof populate) === 'string') {
    
    } else if(populate instanceof Array) {
        
    } else if(populate instanceof Object) {

    } else {
        return {  errMsg: `[paramObj.populate] 参数错误` };
    }
    param.populate = populate;
}

/**
 * // 批量 读取 更新 删除时 获取param
 * @param {required, 要操作的数据模型} doc 
 * @param {required, 前台想要操作的方式} paramObj 
 * @returns 
 */
exports.obtParam_ManyPre = (doc, paramObj) => {
    let param = {};     // 最终返回的数据 参数
    let {filter, select={}, skip, limit, sort, populate} = paramObj;
    if(filter) {    // 
        let matchObj = { "$or": [] };
        let {search, match, includes={}, excludes={}, lte={}, gte={}, at_before={}, at_after={}} = filter;
        if(search) {
            if(!search.fields) return {errMsg: "数据层 paramObj.filter.search 参数错误 需要传递 [search.fields] 参数" };
            search.keywords = String(search.keywords).replace(/(\s*$)/g, "").replace( /^\s*/, '');
            if(!search.keywords) {
                search.fields = null;
                search.keywords = null;
            } else {
                let keywords = new RegExp(search.keywords + '.*');
                search.fields  = (search.fields instanceof Array) ? search.fields : [search.fields];
                for(i in search.fields) {
                    let field = search.fields[i];
                    let docField = obt_docFieldObj(doc, field);
                    if(docField.errMsg) return { errMsg: '[paramObj.filter.search.fields]: '+docField.errMsg};

                    if(docField.type !== String) return { errMsg: `数据层readPre [paramObj.filter.search.fields 的值 ${field}] 错误, 应该传递类型为<String>的<field>` };
                    matchObj["$or"].push({[field]: { $regex: keywords, $options: '$i' }});
                }
            }
            param.search = search;
        }
        if(matchObj["$or"].length === 0) delete matchObj["$or"];
        for(key in match) {
            let docField = obt_docFieldObj(doc, key);
            if(docField.errMsg) {
                if(IS_STRICT) {
                    return {errMsg: docField.errMsg};
                } else {
                    continue;
                }
            }

            if(docField.type === ObjectId && !isObjectId(match[key]) ) return { errMsg: `数据层readPre [paramObj.filter.match.${key}] 类型为 ObjectId, 请您检查` };
            matchObj[key] = match[key];
        }
        for(key in includes) {
            let docField = obt_docFieldObj(doc, key);
            if(docField.errMsg) {
                if(IS_STRICT) {
                    return {errMsg: docField.errMsg};
                } else {
                    continue;
                }
            }

            if(docField.type === ObjectId ) {
                let vals = includes[key];
                for(let i=0; i<vals.length; i++) {
                    if(!isObjectId(vals[i])) return { errMsg: `[paramObj.filter.includes.${key}] 类型为 ObjectId` };
                }
            }
            matchObj[key] = {"$in": includes[key]};
        }
        for(key in excludes) {
            let docField = obt_docFieldObj(doc, key);
            if(docField.errMsg) {
                if(IS_STRICT) {
                    return {errMsg: docField.errMsg};
                } else {
                    continue;
                }
            }

            if(docField.type === ObjectId && !isObjectId(excludes[key]) ) return { errMsg: `[paramObj.filter.excludes.${key}] 类型为 ObjectId` };
            matchObj[key] = {"$nin": excludes[key]};
        }
        for(key in lte) {
            let docField = obt_docFieldObj(doc, key);
            if(docField.errMsg) {
                if(IS_STRICT) {
                    return {errMsg: docField.errMsg};
                } else {
                    continue;
                }
            }

            if(docField.type !==  Number) return { errMsg: `[paramObj.filter.lte 的 key ${key}] 必须为Number类型` };
            matchObj[key] = {"$lte": lte[key]};
        }
    
        for(key in gte) {
            let docField = obt_docFieldObj(doc, key);
            if(docField.errMsg) {
                if(IS_STRICT) {
                    return {errMsg: docField.errMsg};
                } else {
                    continue;
                }
            }

            if(docField.type !==  Number) return { errMsg: `[paramObj.filter.gte 的 key ${key}] 必须为Number类型` };
            
            matchObj[key] = {"$gte": gte[key]};
        }
        for(key in at_before) {
            let docField = obt_docFieldObj(doc, key);
            if(docField.errMsg) {
                if(IS_STRICT) {
                    return {errMsg: docField.errMsg};
                } else {
                    continue;
                }
            }

            if(docField.type !==  Date) return { errMsg: `[paramObj.filter.at_before 的 key ${key}] 必须为 Date 类型` };
            let before = (new Date(at_before[key]).setHours(23,59,59,999));
            matchObj[key] = {"$lte": before};
        }
        for(key in at_after) {
            let docField = obt_docFieldObj(doc, key);
            if(docField.errMsg) {
                if(IS_STRICT) {
                    return {errMsg: docField.errMsg};
                } else {
                    continue;
                }
            }

            if(docField.type !==  Date) return { errMsg: `[paramObj.filter.at_after 的 key ${key}] 必须为 Date 类型` };
            let after = (new Date(at_after[key]).setHours(0,0,0,0));
            matchObj[key] = {"$gte": after};
        }
        param.match = matchObj;
    }

    let errMsg = setProject(doc, param, select);
    if(errMsg) return { errMsg };

    if(skip) {
        if(isNaN(skip) || skip < 0) if(docField.type !==  Date) return { errMsg: `[paramObj.skip] 必须为大于0的 Number 类型` };
        param.skip = skip;
    }

    if(limit) {
        if(isNaN(limit) || limit < 0) return { errMsg: `[paramObj.limit] 必须为大于0的 Number 类型` };
        param.limit = limit;
    } 

    if(sort) {
        for(key in sort) {
            let docField = obt_docFieldObj(doc, key);
            if(docField.errMsg) return  { errMsg: `[paramObj.sort 的 ${key}] 不是该数据的字段- `+docField.errMsg };
            if(sort[key] !== -1 && sort[key] !== "-1")  sort[key] = 1;
        }
        param.sort = sort;
    }

    if(populate) {
        let errMsg = setProject(doc, param, select);
        if(errMsg) return {errMsg};
    }

    return param;
}

exports.obtParam_OnePre = (doc, paramObj) => {
    let param = {};
    let {match={}, select, populate} = paramObj;
    if(!match._id) return {errMsg: "查找detail数据时 请输入数据的 _id"};
    param.match = paramObj.match;

    let errMsg = null;

    errMsg = setProject(doc, param, select);
    if(errMsg) return {errMsg};

    if(populate) {
        errMsg = setProject(doc, param, select);
        if(errMsg) return {errMsg};
    }

    return param;
}