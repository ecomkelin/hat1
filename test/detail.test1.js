const server = require("./server");

test("json 接口返回数据格式正确", async() => {

    const UserDetail_res = await server.post('/v1/user/Detail').send({"_id": "62c41be8944f7508d1098649"});
    expect(UserDetail_res.body.status).toBe(200);

})