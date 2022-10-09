const Auth = require(path.resolve(process.cwd(), "src/bin/js/resProm/authrize"));

const Model = require(path.resolve(process.cwd(), "src/app/dbModels/1_person/User/Model"));

module.exports = async(ctx, next) => {
    try{
      if(ctx.request.query.api == 1) return resAPI(ctx, api, next);
      let res = await Auth.refresh_Pres(ctx, Model);
      return resSUCCESS(ctx, res, next);
    } catch(e) {
        return resERR(ctx, e, next);
    }
};


const api = {
  
}