module.exports = {
	code: {required: true,min: 4, max: 20, regexp: '^[a-zA-Z0-9]*$', errMsg: {
		nullMsg: '成员账号不能为空',
		regexpMsg: '成员账号只能由数字和字母组成',
		minMsg: '成员账号的位数不能小于: ',
		maxMsg: '成员账号的位数不能大于: '
	}},

	pwd: {required: true, min: 6, max: 12, errMsg: {
		nullMsg: '密码不能为空',
		minMsg: '密码的位数不能小于: ',
		maxMsg: '密码的位数不能大于: '
	}},

	name: {regexp: '^[a-zA-Z0-9]*$', min: 4, max: 20, errMsg: {
		regexpMsg: '成员姓名只能由数字和字母组成',
		minMsg: '成员姓名的位数不能小于: ',
		maxMsg: '成员姓名的位数不能大于: '
	}},

	phonePre: {trim: 4, regexp: '^[0-9]*$', errMsg: {
		regexpMsg: '电话号码前缀只能由数字组成',
		trimMsg: '电话号码前缀长度只能为: ',
	}},
	phoneNum: {trim: 10, regexp: '^[0-9]*$', errMsg: {
		regexpMsg: '电话号码只能由数字组成',
		trimMsg: '电话号码的长度只能为: ',
	}},
}