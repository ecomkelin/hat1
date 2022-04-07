/**
    主要： 验证前端给的数据是否符合要求， 比如 post时 code的长度及字符是否符合 edit/get/delete时 id是否为 ObjectId(当然如果前台没有要求不算)
    也会跳过一些不合理的要求 比如 post时 给了多出的数据库的字段
*/
const path = require('path');
const {isObjectId} = require("../../extra/judge/is_ObjectId");

const {failure, errs} = require("../../resJson");
const { UserSchema, restrict_User } = require(path.resolve(process.cwd(), "src/models/User"));

exports.add = async(ctx, next) => {
    const position = "@/app/middle/User.js add";
    try {
        const body = ctx.request.body;
        const keys = Object.keys(restrict_User);

        for(let i=0; i<keys.length; i++) {
            const key = keys[i];

            // 先判断是否可以为空
            if(restrict_User[key].required === true) {
                if(body[key] === null || body[key] === undefined) {
                    const message = restrict_User[key].errMsg.nullMsg;
                    return failure(ctx, {position, message});
                }
            } else {
                if(body[key] === null || body[key] === undefined) continue;
            }

            if(restrict_User[key].trim && restrict_User[key].trim !== body[key].length) {
                const message = restrict_User[key].errMsg.trimMsg+restrict_User[key].trim;
                return failure(ctx, {position, message});
            }

            if(restrict_User[key].min && restrict_User[key].min > body[key].length) {
                const message = restrict_User[key].errMsg.minMsg+restrict_User[key].min;
                return failure(ctx, {position, message});
            }

            if(restrict_User[key].max &&  restrict_User[key].max < body[key].length) {
                const message = restrict_User[key].errMsg.maxMsg+restrict_User[key].max;
                return failure(ctx, {position, message});
            }

            if(restrict_User[key].regexp) {
                const regexp = new RegExp(restrict_User[key].regexp);
                if(!regexp.test(body[key])) {
                    const message = restrict_User[key].errMsg.regexpMsg;
                    return failure(ctx, {position, message});
                }
            }
        }

        await next();
    } catch(err) {
        return errs(ctx, {position, err});
    }
}

exports.edit = async(ctx, next) => {
    const position = "@/app/middle/User.js create";
    try {
        const body = ctx.request.body;
        const keys = Object.keys(restrict_User);

        for(let i=0; i<keys.length; i++) {
            const key = keys[i];

            // 先判断是否可以为空
            if(restrict_User[key].required === true) {
                if(body[key] === null || body[key] === undefined) {
                    const message = restrict_User[key].errMsg.nullMsg;
                    return failure(ctx, {position, message});
                }
            } else {
                if(body[key] === null || body[key] === undefined) continue;
            }

            if(restrict_User[key].trim && restrict_User[key].trim !== body[key].length) {
                const message = restrict_User[key].errMsg.trimMsg+restrict_User[key].trim;
                return failure(ctx, {position, message});
            }

            if(restrict_User[key].min && restrict_User[key].min > body[key].length) {
                const message = restrict_User[key].errMsg.minMsg+restrict_User[key].min;
                return failure(ctx, {position, message});
            }

            if(restrict_User[key].max &&  restrict_User[key].max < body[key].length) {
                const message = restrict_User[key].errMsg.maxMsg+restrict_User[key].max;
                return failure(ctx, {position, message});
            }

            if(restrict_User[key].regexp) {
                const regexp = new RegExp(restrict_User[key].regexp);
                if(!regexp.test(body[key])) {
                    const message = restrict_User[key].errMsg.regexpMsg;
                    return failure(ctx, {position, message});
                }
            }
        }

        await next();
    } catch(err) {
        return errs(ctx, {position, err});
    }
}

exports.list = async(ctx, next) => {
    const position = "@/app/middle/User.js list";
    try {
        const body = ctx.request.body;
        const {filter={}, select={}, skip, limit, sort={}, populate} = body;
        const {match, fuzzy, includes, excludes, at_before, at_after, gte, lte} = filter;
        body.matchObj = {...match};
        if(fuzzy) {

        } 
        if(skip !== undefined) {
            if(isNaN(skip)) {    // 还有其他判断
                const message = "您的 [skip] 参数传递错误, 应该是正整数";
                return failure(ctx, {position, message});
            }
        }
        if(limit !== undefined) {
            if(isNaN(limit)) return failure(ctx, {position, limit});
        }

        for(key in select) {
            if(select[key] != 1 && select[key] != 0) {
                select[select[key]] = "$"+key;
                delete select[key];
            }
        }

        for(key in sort) {
            if(sort[key] !== 1 && sort[key] !== -1) {
                return failure(ctx, {position, sort});
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
        await next();
    } catch(err) {
        return errs(ctx, {position, err});
    }
    
}

exports.del = async(ctx, next) => {
    const position = "@/app/middle/User.js delete";
    try {
        if(!isObjectId(ctx.request.params.id)) return failure(ctx, {position, message});

        await next();
    } catch(err) {
        return errs(ctx, {position, err});
    }
}



exports.edit = async(ctx, next) => {
    const position = "@/app/middle/User.js edit";
    try {
        if(!isObjectId(ctx.request.params.id)) return failure(ctx, {position, message});

        await next();
    } catch(err) {
        return errs(ctx, {position, err});
    }
}




exports.detail = async(ctx, next) => {
    const position = "@/app/middle/User.js detail";
    try {
        const id = ctx.request.params.id;
        if(!isObjectId(id)) return failure(ctx, {position, message:"请传递正确的id信息", id: id});

        await next();
    } catch(err) {
        return errs(ctx, {position, err});
    }
}