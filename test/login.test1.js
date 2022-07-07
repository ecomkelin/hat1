const server = require("./server");

test("user login test", async() => {

    const login_res = await server.post('/v1/user/login').send({
        "type_login": "hat",
        "hat": {
            "code": "0001",
            "pwd": "123456"
        }
    });
    expect(login_res.body.status).toBe(200);

})