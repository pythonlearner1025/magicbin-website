const crypto = require("crypto");
const express = require("express");
const axios = require("axios");
const fs = require("fs");
const expressPort = 8000;

var app = express();
var cors = require('cors');
app.use(cors());
app.use(express.json());

// private key
const privKey = "./crypto/private.pem"

// endpoint to redis server
// test 
const REDIS_SERVER = "http://localhost:3000";

function encryptSig(data){

    const privateKey = fs.readFileSync(privKey);
    const data_string = JSON.stringify(data)

    const signature = crypto.sign("sha256", Buffer.from(data_string),{
        key:privateKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    });
    console.log('sig',signature.toString("base64"))
    return signature.toString('base64');
}


app.post("/route/newuser", async function(req,res){
    console.log('**************************************************')
    console.log('/route/newuser')

    const data = req.body.data; 
    const sig = encryptSig(data);
    console.log('data', data)
    console.log('sig', sig)
    const rep = await axios.post(REDIS_SERVER + "/register/newuser", {
        data: data,
        sig: sig,
    }
    );

    if (rep.data.success == true){
        console.log("success: true")
        res.status(200).json({"success": true});
    } else {
        console.log("success: false")
        res.status(200).json({"success": false});
    }
})

app.post("/route/user", async function(req,res){
    console.log('**************************************************')
    console.log('/route/user')

    const data = req.body.data;
    const sig = encryptSig(data);
    console.log('data', data)
    console.log('sig', sig)
    const rep = await axios.post(REDIS_SERVER + "/register/user", {
        data: data,
        sig: sig, 
    }
    )
    if (rep.data.success == true){
        console.log("success: true")
        res.status(200).json({"success": true});
    } else {
        console.log("success: false")
        res.status(200).json({"success": false});
    }
})

app.listen(expressPort, ()=>{
    console.log("listening on port... ", expressPort);
})





