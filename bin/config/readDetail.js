module.exports = {
    "_id": "要查找的 ObjectId",
    "paramObj": {
        "filter": {
            "match": {
                "$key": "需要匹配数据的字段",
                "$value": "完全匹配的值不区分大小写",
            },
            "includes": {
                "$key": "需要匹配数据的ObjectId字段 比如 Shop Categ Skus",
                "$value": "完全匹配的ObjectIds 为数组",
            },
            "excludes": {
                "$key": "排除匹配数据的ObjectId字段 比如 Shop Categ Skus",
                "$value": "完全匹配的ObjectIds 为数组",
            }
        },
        "select": {

        },
        "populate": {
            
        }
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