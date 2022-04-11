/**
    主要： 验证前端给的数据是否符合要求， 比如 post时 code的长度及字符是否符合 modify/get/delete时 id是否为 ObjectId(当然如果前台没有要求不算)
    也会跳过一些不合理的要求 比如 post时 给了多出的数据库的字段
*/
const path = require('path');
const {ObjectId, isObjectId} = require("../extra/judge/is_ObjectId");

const {failure, errs} = require("../resJson");
const isField = (doc, field) => {
    if(field === "_id") return true;
    if(doc && doc[field]) return true;
    return false;
}
const isFieldType = (doc, field, type) => {
    if(field === "_id") return type === ObjectId ? true : false;
    if(doc && doc[field]) return type === doc[field].type ? true: false;
    return false;
}
exports.list = doc => async(ctx, next) => {
    const position = "@/middle/preCT.js list";
    try {
        const body = ctx.request.body;
        const {filter={}, select={}, skip=0, limit=50, sort={}, populate} = body;
        const {search={}, match, includes={}, excludes={}, lte={}, gte={}, at_before={}, at_after={}} = filter;

        const matchObj = {"$or" : []};
        if(search.fields && search.keywords) {
            const keywords = new RegExp(String(search.keywords).replace(/(\s*$)/g, "").replace( /^\s*/, '')+ '.*');
            if(search.fields instanceof Array) {
                for(i in search.fields) {
                    const field = search.fields[i];
                    if(isField(doc, field)) {
                        if(!isFieldType(doc, field, String)) return failure(ctx, {position, message: `search参数[${field}] 传递错误, 应该传递类型为<String>的<field>`});
                        matchObj["$or"].push({[field]: { $regex: keywords, $options: '$i' }});
                    }
                }
            } else {
                const field = search.fields;
                if(isField(doc, field)) {
                    if(!isFieldType(doc, field, String)) return failure(ctx, {position, message: `search参数[${field}] 传递错误, 应该传递类型为<String>的<field>`});
                    matchObj["$or"].push({[field]: { $regex: keywords, $options: '$i' }});
                }
            }
        }
        if(matchObj["$or"].length === 0) delete matchObj["$or"];
        for(key in match) {
            if(!isField(doc, key)) continue;
            if(isFieldType(doc, key, ObjectId) && !isObjectId(match[key]) ) return failure(ctx, {position, message: `[match.${key}] 类型为 ObjectId`});
            matchObj[key] = match[key];
        }
        for(key in includes) {
            if(!isField(doc, key)) continue;
            if(isFieldType(doc, key, ObjectId) && !isObjectId(includes[key]) ) return failure(ctx, {position, message: `[includes.${key}] 类型为 ObjectId`});
            matchObj[key] = {"$in": includes[key]};
        }
        for(key in excludes) {
            if(!isField(doc, key)) continue;
            if(isFieldType(doc, key, ObjectId) && !isObjectId(excludes[key]) ) return failure(ctx, {position, message: `[excludes.${key}] 类型为 ObjectId`});
            matchObj[key] = {"$nin": excludes[key]};
        }
        for(key in lte) {
            if(!isField(doc, key)) continue;
            if(!isFieldType(doc, key, Number)) return failure(ctx, {position, message: `应该传递 Number 类型的Field [${key}] 不是Number类型`});
            matchObj[key] = {"$lte": lte[key]};
        }

        for(key in gte) {
            if(!isField(doc, key)) continue;
            if(!isFieldType(doc, key, Number))  return failure(ctx, {position, message: `应该传递 Number 类型的Field [${key}] 不是Number类型`});
            matchObj[key] = {"$gte": gte[key]};
        }
        for(key in at_before) {
            if(!isField(doc, key)) continue;
            if(!isFieldType(doc, key, Date))  return failure(ctx, {position, message: `应该传递 Date 类型的Field [${key}] 不是Date类型`});
            const before = (new Date(at_before[key]).setHours(23,59,59,999));
            matchObj[key] = {"$lte": before};
        }
        for(key in at_after) {
            if(!isField(doc, key)) continue;
            if(!isFieldType(doc, key, Date))  return failure(ctx, {position, message: `应该传递 Date 类型的Field [${key}] 不是Date类型`});
            const after = (new Date(at_after[key]).setHours(0,0,0,0));
            matchObj[key] = {"$gte": after};
        }

        if(isNaN(skip) || skip < 0) {
            return failure(ctx, {position, message: `您的 [skip = ${skip}] 参数传递错误, 应该是正整数`});
        }
        if(isNaN(limit) || limit < 0) {
            return failure(ctx, {position, message: `您的 [limit = ${limit}] 参数传递错误, 应该是正整数`});
        }

        for(key in select) {
            if(!isField(doc, key)) return failure(ctx, {position, message: `数据库中 没有[${key}]field, 不能写在<select>下`});
            if(select[key] != 1 && select[key] != 0) {
                select[select[key]] = "$"+key;
                delete select[key];
            }
        }
        // 必须隐藏的值
        for(key in doc) {
            if(doc[key].select === 0 && select[key] === 1) {
                return failure(ctx, {position, message: `[select.${key}] 的值 不能为1`});
            }
        }

        for(key in sort) {
            if(!isField(doc, key)) return failure(ctx, {position, message: `数据库中 没有[${key}]field, 不能写在<sort>下`});
            if(sort[key] !== -1 && sort[key] !== "-1") {
                sort[key] = 1
            }
        }
        if(populate) {
            if((typeof populate) === 'string') {

            } else if(populate instanceof Array) {
                
            } else if(populate instanceof Object) {

            } else {
                const message = "您的 [populate] 参数传递错误, 应该是正整数";
                return failure(ctx, {position, message});
            }
        }

        ctx.request.body = {
            match: matchObj,
            select,
            skip,
            limit,
            sort,
            populate
        }
        await next();
    } catch(err) {
        return errs(ctx, {position, err});
    }
    
}

exports.create = doc => async(ctx, next) => {
    const position = "@/middle/preCT.js create";
    try {
        const body = ctx.request.body;

        for(key in body) {
            if(!doc[key]) {
                return failure(ctx, {position, message: `没有[${key}] 此字段`});
            }
            if(doc[key].is_auto) {
                return failure(ctx, {position, message: `[${key}]为自动生成数据, 不可手动添加`});
            }

            if(doc[key].trimLength && doc[key].trimLength !== body[key].length) {
                return failure(ctx, {position, message: `[${key}] 字段的字符串长度必须为 [${doc[key].trimLength}]`});
            }

            if(doc[key].minLength && doc[key].minLength > body[key].length) {
                return failure(ctx, {position, message: `[${key}] 字段的字符串长度为： [${doc[key].minLength} ~ ${doc[key].maxLength}]`});
            }
            
            if(doc[key].maxLength &&  doc[key].maxLength < body[key].length) {
                return failure(ctx, {position, message: `[${key}] 字段的字符串长度为： [${doc[key].minLength} ~ ${doc[key].maxLength}]`});
            }
            
            if(doc[key].regexp) {
                const regexp = new RegExp(doc[key].regexp);
                if(!regexp.test(body[key])) {
                    return failure(ctx, {position, message: `[${key}] 的规则： [${doc[key].regErrMsg}]`});
                }
            }
        }
        for(key in doc) {
            // 先判断是否可以为空
            if(doc[key].required === true) {
                if(body[key] === null || body[key] === undefined) {
                    return failure(ctx, {position, message: `创建时 必须添加 [${key}] 字段`});
                }
            } else {
                if(body[key] === null || body[key] === undefined) continue; // 如果前台没有给数据则可以跳过 不判断后续
            }
        }

        await next();
    } catch(err) {
        return errs(ctx, {position, err});
    }
}
exports.modify = doc => async(ctx, next) => {
    const position = "@/middle/preCT.js modify";
    try {
        if(!isObjectId(ctx.request.params.id)) return failure(ctx, {position, message});
        const body = ctx.request.body;
        for(key in body) {
            if(!doc[key]) {
                return failure(ctx, {position, message: `没有[${key}] 此字段`});
            }
            if(doc[key].is_auto) {
                return failure(ctx, {position, message: `[${key}]为自动生成数据, 不可手动修改`});
            }
            if(doc[key].is_is_fixed) {
                return failure(ctx, {position, message: `[${key}]为不可修改数据`});
            }
            
            // 先判断是否可以为空
            if(doc[key].required !== true, body[key] === null) continue;

            if(doc[key].trimLength && doc[key].trimLength !== body[key].length) {
                return failure(ctx, {position, message: `[${key}] 字段的字符串长度必须为 [${doc[key].trimLength}]`});
            }

            if(doc[key].minLength && doc[key].minLength > body[key].length) {
                return failure(ctx, {position, message: `[${key}] 字段的字符串长度为： [${doc[key].minLength} ~ ${doc[key].maxLength}]`});
            }
            
            if(doc[key].maxLength &&  doc[key].maxLength < body[key].length) {
                return failure(ctx, {position, message: `[${key}] 字段的字符串长度为： [${doc[key].minLength} ~ ${doc[key].maxLength}]`});
            }
            
            if(doc[key].regexp) {
                const regexp = new RegExp(doc[key].regexp);
                if(!regexp.test(body[key])) {
                    return failure(ctx, {position, message: `[${key}] 的规则： [${doc[key].regErrMsg}]`});
                }
            }
        }
        await next();
    } catch(err) {
        return errs(ctx, {position, err});
    }
}


exports.delete = doc => async(ctx, next) => {
    const position = "@/middle/preCT.js delete";
    try {
        if(!isObjectId(ctx.request.params.id)) return failure(ctx, {position, message});

        await next();
    } catch(err) {
        return errs(ctx, {position, err});
    }
}








exports.detail = doc => async(ctx, next) => {
    const position = "@/middle/preCT.js detail";
    try {
        const id = ctx.request.params.id;
        if(!isObjectId(id)) return failure(ctx, {position, message:"请传递正确的id信息", id: id});

        await next();
    } catch(err) {
        return errs(ctx, {position, err});
    }
}