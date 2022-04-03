// 只有总公司管理员以上级别可以创建
api = "https://example.com/b1/User/list";
method = "POST";
headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json',
	"authorization": "auth"+" "+accessToken
}

body = 
{
    filter: {
        match: {
            code: {required: false, type: String, description: "是否可用"},
            is_usable: {required: false, type: Boolean, default: true, description: "店铺是否可用"},
        },
        unMatch: {

        },

        fuzzy: {
            fields: [String],
            keyword: String,
        },

        includes: {
            _id: {required: false, type: Array[ObjectID], default: [], description: "查找包含所有此数组中所有IDs的店铺"},
            User_crt: {required: false, type: Array[ObjectID], default: [], description: "查找此人创建的店铺", },
            User_upd: {required: false, type: Array[ObjectID], default: [], description: "查找此人更新的店铺", },
        },
        excludes: {required: false, type: Array[ObjectID], default: [], description: "查找出去此数组中所有IDs之外的店铺", },

        at_before: {
            at_crt: {required: false, type: date, description: "给出一个时间格式[MM/DD/YYYY], 搜索此时间戳之后创建的店铺"},
            at_upd: {required: false, type: date, description: "给出一个时间格式[MM/DD/YYYY], 搜索此时间戳之后创建的店铺"},
        },
        at_after: {
            at_crt: {required: false, type: date, description: "给出一个时间格式[MM/DD/YYYY], 搜索此时间戳之后创建的店铺"},
            at_upd: {required: false, type: date, description: "给出一个时间格式[MM/DD/YYYY], 搜索此时间戳之后创建的店铺"},
        },
        gte: {

        },
        lte: {

        },
    },
    select: {},
    skip: Number,
    limit: Number,
    sort: {
        
    },
    populate: [{
        path: "",
        select: "",
        option: {

        },
        populate: [{
            ...populate
        }]
    }],
};

// 返回值
// status(200);