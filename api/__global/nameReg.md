数据库字段
    数据库文档名称 h[n]_Xxxx_dbs 如： hat_User_dbs hat_City_dbs

    string类型 为小写   code name 
        词组为驼峰式
    Number类型 后面加 Num
    数组类型 后面加s     types Users Citys
    对象类型 后面加Info     shipInfo billInfo attrInfo
    布尔类型 is_usable, is_discount, is_shell
    时间字段 at_crt, at_upd, at_order
    关联字段 首字母大写末尾加_db Prod_db Sku_dbs  crtUser_db, updUser_db

系统变量
    配置中的常量 所有字母大写 SERVER_PORT
    strig类型 尽量小写 词组驼峰式
    Array类型 尽量末尾加s   例如 Users
    对象类型 尽量末尾加Obj      例如 matchObj
    数组对象 尽量末尾加 Objs     例如 populateObjs

引入require单双引号区分 为了 [command/ctrl + d]
    框架自带 和 npm安装的 单引号引入
    npm安装 单引号引入