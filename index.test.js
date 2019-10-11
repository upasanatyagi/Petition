const supertest = require("supertest");
const { app } = require("./index");
// this is requirecing cokkie session mock
const cookieSession = require("cookie-session");

test("GET/welcome sends 200 status code as response", () => {
    return supertest(app)
        .get("/welcome") ///async function
        .then(res => {
            console.log(res);
            expect(res.statusCode).tobe(200);
        }); //response object will be passed to then,3 main properties of 'res' we care about:status code,headers, test
});
//test function
test("GET/home redirects me to /welcome", () => {
    return supertest(app)
        .get("/home")
        .then(res => {
            //when redirection happens sets 302 and sets it to a different header,location tell where are user is been redirected too
            expect(res.headers.location).toBe("/welcome");
            expect(res.statusCode).toBe(302);
        });
});
//test with cookie,cookie session mockSession

test("POST /welcome sets wasWelcomed cookie to true", () => {
    // this is creating a cookie
    let cookie = {};
    cookieSession.mockSessionOnce(cookie);
    // now make post request
    return supertest(app)
        .post("/welcome")
        .then(res => {
            //console.log(cookie);//cookie becomes req.session in server
            expect(cookie).toEqual({
                wasWelcomed: true //matchers to object
            });
        });
});

test("GET/home sends h1 was response when wasWelcomed cokkie is sent", () => {
    let cookie = {
        //cookie can be any variable
        wasWelcomed: true
    };
    cookieSession.mockSessionOnce(cookie);

    return supertest(app)
        .get("/home")
        .then(res => {
            // console.log(res);
            expect(res.statusCode).toBe(200);
            expect(res.text).toBe("hi");
        });
});
