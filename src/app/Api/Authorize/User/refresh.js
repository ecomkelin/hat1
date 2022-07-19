const path = require('path');
const Auth = require(path.resolve(process.cwd(), "src/bin/js/resProm/authrize"));

const Model = require(path.resolve(process.cwd(), "src/app/dbModels/1_person/User/Model"));

module.exports = async(ctx, next) => {
    try{
      if(ctx.request.query.api == 1) return global.api(ctx, api, next);
      let res = await Auth.refresh_Pres(ctx, Model);
      return global.success(ctx, res, next);
    } catch(e) {
        return global.errs(ctx, e, next);
    }
};


const api = {
  
}