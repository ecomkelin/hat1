/* ======================================== 数据库接口 ======================================== */
readONE = {
    "_id": "${ObjectID}, 简化用的, 如果有此 _id, match中的_id就会被覆盖",
    "match": {
        "_id": "要查找的 ObjectId",
    },
    "select": {
        "$key<field>": "$content< 1 / -1 / String > 映射"
    },

    "populate": "$content < String / Object / [Object] > 详情查看 mongoose populate"
};

readMANY = {
    "paramObj": {
        "filter": {
            "search": {
                "fields": "$<String> / <[String]> 需要匹配的字段",
                "keywords": "<String> 对fields的模糊匹配 不分大小写"
            },
            "match": {
                "$key": "$value 完全匹配的值不区分大小写",
            },
            "includes": {
                "$key": "$[ObjectId] 完全匹配的数据",
            },
            "excludes": {
                "$key": "排除匹配的 $[ObjectId]",
            },
            "gte": {
                "$key": "$<Number / Float> 大于此值的 field"
            },
            "lte": {
                "$key": "$content<Number / Float> 小于此值的 field"
            },
            "at_before": {
                "$key": "$content<Date> 在此时间之前的数据"
            },
            "at_after": {
                "$key": "$content<Date> 在此时间之后的数据"
            },
        },
        "select": {
            "$key<field>": "$content< 1 / -1 / String > 映射"
        },
        "skip": "$content<Number> 跳过 Number 条数据 查找",
        "limit": "$content<Number> 查找 Number 条数据",
        "sort": {
            "$key<field>": "$content< 1 / -1> 排序"
        },
        "populate": "$content < String / Object / [Object] > 详情查看 mongoose populate"
    }
};