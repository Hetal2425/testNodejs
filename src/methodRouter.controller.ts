const connection = require('./db');
// import { Request, Response } from "express";
import { User } from "./entity/User";

//startConnection function is for find connection with data base and excess with userRepository to change database
let userRepository;
async function startConnection() {
    connection.then(connection => {
        try {
            userRepository = connection.getRepository(User);
        }
        catch (error) {
            console.log("database is not connect", error);

        }
    });
}
startConnection();
//to get data
// - fetch a user matching the query
// - if no query params are specified, return all
var GetData = async function (req, res) {
    let results;
    let idString = req.url.split("id=")[1];

    if (idString) {
        let id = idString.split("&")[0];
        let phoneNumber = req.url.split("phoneNumber=")[1];
        try {
            results = await userRepository.findOne({ id, phoneNumber });
            if (results) {
                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ results }));
            }
            else {
                // return res.status(400).end('invalid id or phone number');
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "invalid id or phone number" }));

            }
        } catch (err) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "invalid id or phone number" }));
        }
    }
    else {
        try {
            res.writeHead(201, { "Content-Type": "application/json" });
            results = await userRepository.find();
            res.end(JSON.stringify({ results }));
            // console.log("result",results);

        } catch (error) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: " not found" }));
        }
    }

}
function getReqData(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = "";
            // listen to data sent by client
            req.on("data", (chunk) => {
                // append the string version to the body
                body += chunk.toString();
            });
            // listen till the end
            req.on("end", () => {
                // send back the data
                resolve(body);
            });
        } catch (error) {
            reject(error);
        }
    });
}
// to create a user
var PostData = async function (req, res) {
    let results;
    const data = await getReqData(req);

    const body_data = JSON.parse(`${data}`)
    // console.log("req.body==>",{ phoneNumber:data[0].phoneNumber});
    const phoneNumber = body_data.results.phoneNumber;
    
    try {
        if (phoneNumber && phoneNumber.toString().length===10) {
            res.writeHead(201, { "Content-Type": "application/json" });
            results = await userRepository.save(body_data.results);
            res.end(JSON.stringify({ results }));
            
        }
        else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Phone number should be 10 digit" }));

        }
    } catch (err) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "invalid data" }));

    }  
}
//to update user data 
var PatchData = async function (req, res) {
    let results;
    let users;
    let idString = req.url.split("id=")[1];
    let id = idString.split("&")[0];
    let oldPhoneNumber = req.url.split("phoneNumber=")[1];
    const data = await getReqData(req);

    const body_data = JSON.parse(`${data}`)
    // console.log("req.body==>",{ phoneNumber:data[0].phoneNumber});
    const phoneNumber = body_data.results.phoneNumber;


    try {
        users = await userRepository.findOne(id, oldPhoneNumber);        
        if (users) {
            if (phoneNumber.toString().length == 10) {
                res.writeHead(404, { "Content-Type": "application/json" });
                userRepository.merge(users, body_data.results);
                results = await userRepository.save(users);
                return res.end(JSON.stringify({ results }));
            }
            else {
                // return res.end('phone number should be 10 digit');
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "phone number should be 10 digit" }));
            }
        }
        else {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "invalid  id or phone number" }));
        }
    }
    catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "invalid  id or phone number" }));
    }
}

//to delete user data 
var DeleteData = async function (req, res) {
    let results;
    let idString = req.url.split("id=")[1];
    let id = idString.split("&")[0];
    let phoneNumber = req.url.split("phoneNumber=")[1];

    try {
        if (phoneNumber && id) {
            res.writeHead(400, { "Content-Type": "application/json" });
            results = await userRepository.delete({ id, phoneNumber });
            if (results.affected != 0) {
                return res.end(JSON.stringify({ results }));
            }
            else {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "invalid  id or phone number" }));
            }
        }
        else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "id and phone number require" }));

        }
    } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "invalid  id or phone number" }));    }
}
module.exports = {
    GetData,
    PostData,
    PatchData,
    DeleteData
}

