#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const prompt = require('prompt-sync')();

// Creates .env file each time && configures the server
let setEnv = async () => {
    require('dns').lookup(require('os').hostname(), (err, address, family) => {
        let ip = address;
        let path = "/"
        let port = prompt("Node server port: ");
        const envServer = `\nHOST=${ip} \nPATH=${path} \nPORT=${port} \nCERTKEY=localhost+1-key.pem \nCERT=localhost+1.pem`
        fs.writeFile('../.env', envServer, (err) => {
            if(err !== null) return err;
        });
        exec(`cd ../certificates && mkcert localhost ${ip}`)
    });
};

setEnv();



