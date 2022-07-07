const server = require("./server");

test("json 接口返回数据格式正确", async() => {
    // const res = await server.get('/v');
    // const res = await server.post('/login').send({code: 'code', pwd: '***'});
    // expect(res.body).toEqual({title: 'Koa2 json'});

    const UserList_res = await server.post('/v1/user/list');
    expect(UserList_res.body.status).toBe(200);

})