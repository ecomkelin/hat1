const path = require('path');
const resJson = require(path.resolve(process.cwd(), "bin/response/resJson"));
const Controller = require("../../../collections/0_auth/User/Controller");

module.exports = async(ctx, next) => {
    try{
        if(ctx.request.query.api == 1) return resJson.api(ctx, api);

        let payload = ctx.request.payload;
        let paramObj = ctx.request.body;

        let res = await Controller.detailCT(payload, paramObj);
        return resJson.success(ctx, res);
    } catch(e) {
        return resJson.errs(ctx, {e});
    }
}

const api = {
    filter: {
        search: {
            fields: "<String> / <[String]> 比如 'code' / ['code', 'nome']",
            keywords: "<String> 对fields的模糊匹配 不分大小写"
        },
        match: {
            "$key<field>": "$content<[String/ObjectId/Number/Float]> 精确查找 不分大小戏"
        },
        includes: {
            "$key<field>": "$contents<[ObjectId]> 精确查找"
        },
        excludes: {     // 如果认为前端不需要 可以不写这个
            "$key<field>": "$contents<[ObjectId]> 排除查找"
        },
        gte: {
            "$key<field>": "$content<Number / Float> 大于此值的 field"
        },
        lte: {
            "$key<field>": "$content<Number / Float> 小于此值的 field"
        },
        at_before: {
            "$key<field>": "$content<Date> 在此时间之前的数据"
        },
        at_after: {
            "$key<field>": "$content<Date> 在此时间之后的数据"
        },
    },
    select: {
        "$key<field>": "$content< 1 / -1 / String > 映射"
    },
    skip: "$content<Number> 跳过 Number 条数据 查找",
    limit: "$content<Number> 查找 Number 条数据",
    sort: {
        "$key<field>": "$content< 1 / -1> 排序"
    },
    populate: "$content < String / Object / [Object] > 详情查看 mongoose populate" 
}