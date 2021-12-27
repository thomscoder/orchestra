#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const prompt = require('prompt-sync')();

// Create .env files
let setEnv = async () => {
    require('dns').lookup(require('os').hostname(), (err, address, family) => {
        let ip = address;
        let path = "/"
        let p_port = prompt("Peer server port: ");
        let port = prompt("Node server port: ");
        let r_port = prompt("Client port: ");
        const envServer = `\nHOST=${ip} \nPATH=${path} \nPORT=${port} \nP_PORT=${p_port}`
        const envClient = `\nREACT_APP_ENDPOINT=http://${ip}: \nREACT_APP_HOST=${ip} \nREACT_APP_P_PORT=${p_port} \nREACT_APP_PORT=${port} \nREACT_APP_PATH=${path} \nPORT=${r_port} \nBROWSER=NONE`
        fs.writeFile('.env', envServer, (err) => {
            if(err !== null) return err;
        });
        fs.writeFile('./client/.env', envClient, (err) => {
            if(err !== null) return err;
        });
        exec('cd ./client && yarn start',(err, stdout, stderr) => {
            if(err !== null) return console.error(err);       
        });
        exec('yarn start', (err, stdout, stderr) => {
            if(err !== null) return console.error(err);
        })
        console.log(`Open in browser http://localhost:${r_port}`);
        console.log(`Share it: http://${ip}:${r_port}`);
    });
};

setEnv();



