const path = require('path');
const {ObjectId, isObjectId} = require(path.resolve(process.cwd(), "bin/extra/judge/is_ObjectId"));

exports.listFilter = (doc, paramList) => {
    let paramTemp = {}; 
    let message = format_get(doc, paramList, paramTemp);
    if(message) return {message};

    let paramObj = paramTemp;
    return {paramObj};
}
exports.detailFilter = (doc, paramDetail, id) => {
    if(!isObjectId(id)) return {message: "请传递正确的id信息"};
    delete paramDetail.skip;
    delete paramDetail.limit;
    delete paramDetail.sort;
    let paramTemp = {};
    let message = format_get(doc, paramDetail, paramTemp);
    if(message) return {message};
    if(!paramTemp.match) paramTemp.match = {};
    paramTemp.match._id = id;
    paramObj = paramTemp;
    return {paramObj}
}







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

const format_get = (doc, paramObj, paramTemp) => {
    let {filter, select={}, skip, limit, sort, populate} = paramObj;

    if(filter) {
        let matchObj = {"$or" : []};
        let {search, match, includes={}, excludes={}, lte={}, gte={}, at_before={}, at_after={}} = filter;

        if(search) {
            if(!search.fields) return `search参数传递错误, search的两个参数分别为 fields(String/Array[String] keywords(String))`;
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
                    if(!docField) return `数据库中无 此字段： search参数[${field}] 传递错误`;
                    if(docField.type !== String) return `search参数[${field}] 传递错误, 应该传递类型为<String>的<field>`;
                    matchObj["$or"].push({[field]: { $regex: keywords, $options: '$i' }});
                }
            }
            paramTemp.search = search;
        }
        if(matchObj["$or"].length === 0) delete matchObj["$or"];
        for(key in match) {
            let docField = obt_docField(doc, key);
            if(!docField) continue;
            if(docField.type === ObjectId && !isObjectId(match[key]) ) return `[match.${key}] 类型为 ObjectId`;
            matchObj[key] = match[key];
        }
        for(key in includes) {
            let docField = obt_docField(doc, key);
            if(!docField) continue;
            if(docField.type === ObjectId && !isObjectId(includes[key]) ) return `[includes.${key}] 类型为 ObjectId`;
            matchObj[key] = {"$in": includes[key]};
        }
        for(key in excludes) {
            let docField = obt_docField(doc, key);
            if(!docField) continue;
            if(docField.type === ObjectId && !isObjectId(excludes[key]) ) return `[excludes.${key}] 类型为 ObjectId`;
            matchObj[key] = {"$nin": excludes[key]};
        }
        for(key in lte) {
            let docField = obt_docField(doc, key);
            if(!docField) continue;
            if(docField.type !==  Number) return `应该传递 Number 类型的Field [${key}] 不是Number类型`;
            matchObj[key] = {"$lte": lte[key]};
        }
    
        for(key in gte) {
            let docField = obt_docField(doc, key);
            if(!docField) continue;
            if(docField.type !==  Number)  return `应该传递 Number 类型的Field [${key}] 不是Number类型`;
            matchObj[key] = {"$gte": gte[key]};
        }
        for(key in at_before) {
            let docField = obt_docField(doc, key);
            if(!docField) continue;
            if(docField.type !==  Date)  return `应该传递 Date 类型的Field [${key}] 不是Date类型`;
            let before = (new Date(at_before[key]).setHours(23,59,59,999));
            matchObj[key] = {"$lte": before};
        }
        for(key in at_after) {
            let docField = obt_docField(doc, key);
            if(!docField) continue;
            if(docField.type !==  Date)  return `应该传递 Date 类型的Field [${key}] 不是Date类型`;
            let after = (new Date(at_after[key]).setHours(0,0,0,0));
            matchObj[key] = {"$gte": after};
        }
        paramTemp.query = matchObj;
    }

    if(skip) {
        if(isNaN(skip) || skip < 0) {
            return `您的 [skip = ${skip}] 参数传递错误, 应该是正整数`;
        }
        paramTemp.skip = skip;
    }

    paramTemp.limit = 0; // 在此只判断数值
    if(limit) {
        if(isNaN(limit) || limit < 0) {
            return `您的 [limit = ${limit}] 参数传递错误, 应该是正整数`;
        }
        paramTemp.limit = limit;
    } 

    for(key in select) {
        let docField = obt_docField(doc, key);
        if(!docField) return `数据库中 没有[${key}]field, 不能写在<select>下`;
        if(docField.as === 0) {
            delete select[key];
        } else {
            if(select[key] != 1) {
                select[select[key]] = "$"+key;
                delete select[key];
            }
        }
    }
    paramTemp.projection = select;

    if(sort) {
        for(key in sort) {
            if(!obt_docField(doc, key)) return `数据库中 没有[${key}]field, 不能写在<sort>下`;
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
            return "您的 [populate] 参数传递错误, 应该是正整数";
        }
        paramTemp.populate = populate;
    }
}