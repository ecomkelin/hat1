const path = require('path');
const Auth = require(path.resolve(process.cwd(), "src/bin/res/auth"));
const resJson = require(path.resolve(process.cwd(), "bin/response/resJson"));

const Model = require(path.resolve(process.cwd(), "src/app/models/0_auth/User/Model"));

module.exports = async(ctx, next) => {
    try{
      if(ctx.request.query.api == 1) return resJson.api(ctx, api, next);
      let res = await Auth.refresh_Pres(ctx, Model);
      return resJson.success(ctx, res, next);
    } catch(e) {
        return resJson.errs(ctx, e, next);
    }
};


const api = {
  
}