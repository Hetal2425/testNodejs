var http = require('http');
const url = require('url');

const {
    PostData,
    GetData,
    DeleteData,
    PatchData
} = require('./methodRouter.controller');


const server = http.createServer(async (req, res) => {

    if (req.url.match(/\/user?/) && req.method === "GET") {
        GetData(req, res)
    }
    else if (req.url === "/user" && req.method === "GET") {
        GetData(req, res)
    }
    else if (req.url === "/user" && req.method === "POST") {
        PostData(req, res)
    }
    else if(req.url.match(/\/user?/) && req.method === "PATCH") {
        PatchData(req, res)
    }
    else if(req.url.match(/\/user?/) && req.method === "DELETE") {
        DeleteData(req, res)
    }

})
server.listen(3000, () => {
    console.log(`server started on port: 3000`);
});
