const server = require("./server");

test("json 接口返回数据格式正确", async() => {

    const Create_res = await server.post('/v1/user/Create').send({
        "code": "0006",
        "name": "lin111",
        "pwd": "123456",
        "phoneNum": "3888787897"
    });
    expect(Create_res.body.status).toBe(200);

    const res = await server.post('/v1/user/Create').send({
        "code": "0006",
        "name": "lin111",
        "pwd": "123456",
        "phoneNum": "3888787897"
    });
    expect(res.body.status).toBe(400);

    if(Create_res.body.status === 200) {
        const Remove_res = await server.post('/v1/user/Remove').send({
            "_id": Create_res.body.data.object._id
        });
        expect(Remove_res.body.status).toBe(200);
    }

    expect(Create_res.body.data.object.code).toBe("0006");
    // expect(Create_res.body.data.object.phone).toBe("3888787897");
    expect(Create_res.body.data.object.phone).toBe("+393888787897");



})