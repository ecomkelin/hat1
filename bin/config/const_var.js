const LIMIT_FIND = 50;		// 系统中 默认调取的数据量
if(process.env.LIMIT_FIND) LIMIT_FIND =process.env.LIMIT_FIND;

const PHONE_PRE = '+39';
if(process.env.PHONE_PRE) PHONE_PRE =process.env.PHONE_PRE;

const MONTH = {
    1: "JAN", 2: "FEB", 3: "MAR", 4: "APR", 5: "MAY", 6: "JUN",
    7: "JUL", 8: "AUG", 9: "SEP", 10: "OCT", 11: "NOV", 12: "DEC"
};

module.exports = {
    LIMIT_FIND,
    PHONE_PRE,
    MONTH
}