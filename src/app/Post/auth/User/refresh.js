const path = require('path');
const Auth = require(path.resolve(process.cwd(), "src/bin/res/auth"));
const resJson = require(path.resolve(process.cwd(), "bin/response/resJson"));

const Model = require(path.resolve(process.cwd(), "src/app/collections/0_auth/User/Model"));

module.exports = async(ctx, next) => {
    try{
      let res = await Auth.refresh_Pres(ctx, Model)
      return resJson.success(ctx, res);
    } catch(e) {
        return resJson.errs(ctx, {e});
    }
};