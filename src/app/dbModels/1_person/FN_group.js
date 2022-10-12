const {format_phonePre} = require(path.resolve(process.cwd(), "bin/js/method/Format"));

const new_phoneInfo = (docObj) => {
    if(docObj.phoneNum) {
        docObj.phonePre = format_phonePre(docObj.phonePre);
        docObj.phone = docObj.phonePre+docObj.phoneNum;
    }
}
exports.format_phoneInfo = (docObj, obj={}) => {
    if(obj && obj.phone) {
        if(docObj.phonePre && docObj.phonePre !== obj.phonePre) {
            docObj.phonePre = format_phonePre(docObj.phonePre);
        } else {
            docObj.phonePre = obj.phonePre;
        }
        if(!docObj.phoneNum) {
            docObj.phoneNum = obj.phoneNum;
        }
        docObj.phone = docObj.phonePre+docObj.phoneNum;
    } else {
        new_phoneInfo(docObj);
    }
}
