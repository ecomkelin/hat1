/**
 * 环境变量文件
 */

require('dotenv').config();

/* =============== 常用变量 path ================== */
path = require('path');

require("./const1_system"); // ObjectId 和 resXXX
require("./const2_mongo");
require("./const3_node");
require("./constant");
require("./readConf");
require("./res");
require("./white_url");

/* ======================================== 缓存信息 ======================================== */
is_cache_Role=false;