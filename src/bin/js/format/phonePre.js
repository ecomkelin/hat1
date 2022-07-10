const path = require('path');
const {PHONE_PRE} = require(path.join(process.cwd(), "bin/config/const_var"));

module.exports = (phonePre) => {
	if(!phonePre) return PHONE_PRE;

    phonePre = String(phonePre);
    phonePre = phonePre.replace(/^\s*/g,"");

	if(phonePre.length === 2) {
		if(isNaN(parseInt(phonePre[0])) ) return PHONE_PRE;
		if(isNaN(parseInt(phonePre[1])) ) return PHONE_PRE;
		return "+"+phonePre[0]+phonePre[1];
	} else if(phonePre.length === 3) {
		if(phonePre[0] !== "+") return PHONE_PRE;
		if(isNaN(parseInt(phonePre[1])) ) return PHONE_PRE;
		if(isNaN(parseInt(phonePre[2])) ) return PHONE_PRE;
		return phonePre;
	} else if(phonePre.length === 4) {
		if(phonePre[0] !== "0") return PHONE_PRE;
		if(phonePre[1] !== "0") return PHONE_PRE;
		if(isNaN(parseInt(phonePre[2])) ) return PHONE_PRE;
		if(isNaN(parseInt(phonePre[3])) ) return PHONE_PRE;
		return "+"+phonePre[2]+phonePre[3];
	}
	return PHONE_PRE;
}