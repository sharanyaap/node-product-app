/**
 * Created by sharanya.p on 11/19/2018.
 */
/*
// importing frpm node modules (no ./relative path)
var minimist = require("minimist");

// app/index.js is default import
const app = require('./app');

console.log("node.js server");

var options = minimist(process.argv.slice(2));

console.log(options);
console.log("OTHERS", options._);

const PORT =options.port || 8080;
console.log("PORT", PORT);

app.listen(PORT);
console.log("running on port ", PORT);*/


// server.js

const minimist = require('minimist');
const http = require('http');

const app = require('./app'); // index.js is default

const args = minimist(process.argv.slice(2))

const HOST_IP = args.ip || '127.0.0.1'
const PORT = args.port || 8080
const NODE_ENV = process.env.NODE_ENV || 'development'

console.log('Starting server at ', HOST_IP, PORT)
console.log('Running on ', NODE_ENV)

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

console.log('numCPUS **', numCPUs);

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    console.log('Creating server **')
    const server = http.createServer(app);

    server.listen(PORT, HOST_IP, function(error){
        if (!error) {
            console.log('SERVER STARTED')
        }
    })
}
//console.log(process.env);
// console.log(process.argv)
// console.log(args)