const router = require('@koa/router')({prefix: '/Firm'});

router.post("/create", (ctx, next) => {
    ctx.body = {
        status: 200,
        data: {code: "注册成功"}
    }
})


module.exports = router;