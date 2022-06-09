const doc_global = require("../../_doc/docGlobal");
const doc_group = require("../doc_group");

// 员工编号： {code: "001", Firm: "firmId"} xd公司中是否有 001这个员工编号
// 产品名称： {nome: '002', Brand: 'brandId', Supplier: 'supplierId'} // 这个供应商的这个品牌下 产品的名称不能相同
// 折扣映射： Brand.uniq = ["Supplier"]; 添加折扣文档时 同一个供应商不能有相同的品牌
// const field = {
//     // type: ...
//     // is_auto: ...
//     // uniq: ['field1', 'field2']
// }
// field.uniq = ['field1', 'field2'];

const code = {...doc_group.code};
code.unique = true;


module.exports = {
    ...doc_global,

    ...doc_group,

    code,
    // 权限信息
    roleNum: {type: Number},                                    // 所属部门，或者说我们可以根据这个 来决定用户的界面
    auths: [{type: String}],                                    // 用户权限
};