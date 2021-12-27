#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const prompt = require('prompt-sync')();

// Creates .env file each time && configures the server
let setEnv = async () => {
    require('dns').lookup(require('os').hostname(), (err, address, family) => {
        let ip = address;
        let path = "/"
        let p_port = prompt("Peer server port: ");
        let port = prompt("Node server port: ");
        const envServer = `\nHOST=${ip} \nPATH=${path} \nPORT=${port} \nP_PORT=${p_port} \nCERTKEY=./certficates/${ip}-key.pem \nCERT=./certificates/${ip}.pem`
        fs.writeFile('.env', envServer, (err) => {
            if(err !== null) return err;
        });
        // https cert in local server
        exec(`cd certficates && mkcert ${ip}`)
    });
};

setEnv();



