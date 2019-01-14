// app/index.js

// default file while importing app folder

const express = require('express');
const bodyParser = require('body-parser');
const winston = require('winston'), expressWinston = require('express-winston');
var morgan = require('morgan');

const appKeyMiddleware = require('./lib/appKeyMiddleware');
const dbErrorMiddleware = require('./lib/dbErrorMiddleware');
const productRouter = require('./routers/productRouter');
const brandRouter = require('./routers/brandRouter');

const config = require("./config");
console.log("CONFIG ", config);

const app = express();


app.use(morgan('combined'));
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize()
        , winston.format.json()
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) {
        return false;
    } // optional: allows to skip some log messages based on request and/or response
}));


app.use(bodyParser.json());


// middleware
app.use(function (req, res, nextFunc) {
    console.log("Middleware 1 begin");
    console.log('request', req.method, req.path);
    // forward the request to next middleware
    // or handler method
    nextFunc()

    console.log("middleware 1 end")
});

app.use(function (req, res, next) {
    console.log("middleware 2 begin");
    next()
    console.log("middleware 2 end");
})

app.get("/", function callback(req, res) {
    console.log("get / start");
    res.send("Hello");
    console.log("get / end");
});

app.get("/world", function (req, res) {
    var msg = "Hello";
    res.send("Hello World 2 " + msg);
});


// not invoked for / and /world
// Order matter
app.use(function (req, res, next) {
    console.log("middleware 3 begin");
    next()
    console.log("middleware 3 end");
})


app.use(productRouter);

app.get('/brands', brandRouter.getBrands);
app.get('/brand/:id', brandRouter.getBrand);

//BAD part, browser shall wait for response
// till client timeout
app.get("/no-response", function (req, res) {
    console.log('got request')
});

app.get("/timeout", function (req, res) {
    console.log("timeout enters");
    // value preserved due to visiblity
    // closure, released after setTimeout
    var counter = 100;
    // no visiblity, release after function(req, res)
    var test = 345.6;

    setTimeout(function callback() {
        console.log("inside settimeout");
        counter += 20; //visiblity
        res.send("after timeout " + counter);
    }, 5000);
    counter = 200;
    console.log("timeout exit");
})

app.get("/interval", function (req, res) {
    console.log("interval begin");
    let counter = 0;
    const timer = setInterval(function () {
        counter += 1;
        console.log('set interval called', counter);
        if (counter == 5) {
            res.send("Counter " + counter);
            clearInterval(timer);
        }
    }, 1000);
    console.log("interval exit");
});

app.get("/send", function (req, res) {
    // sends headers, then line 1, then end the response
    res.send("Line 1");
    // error, can't send again
    // res.send("Line 2");
})

// sending partial content to client
app.get("/write", function (req, res) {
    console.log("interval begin");
    let counter = 0;
    const timer = setInterval(function () {
        counter += 1;
        console.log('set interval called', counter);
        // buffer/streaming data
        res.write("<h1 >Counter " + counter + "</h1");
        if (counter == 5) {
            res.end(); // close the connection
            clearInterval(timer);
        }
    }, 1000);
    console.log("interval exit");
});
//
app.get("/json", function (req, res) {
    // send headers, send json content, close connection
    res.json({
        name: 'node.js',
        result: true
    })
})

app.get("/status", function (req, res) {
    // sending status code
    res.sendStatus(404);
})

// GET /query?name=Venkat&id=1234
app.get('/query', function (req, res) {
    res.send('name ' + req.query.name + ' ' +
        req.query.id);
})

// GET /url-data/venkat/1234
// ? optional url param
app.get('/url-data/:name/:id?', function (req, res) {
    res.send('name ' + req.params.name + ' ' +
        req.params.id);
});

// middleware specific to a handler
app.get('/profile', appKeyMiddleware, function (req, res) {
    console.log('profile called')
    res.json({
        name: 'Venkat',
        age: 30
    })
})


app.get("/error", function (req, res) {
    throw new Error("Server crash")
    // non reachable code
});

//TODO: Move to beginning
const DbError = require('./lib/dbErrorMiddleware');

app.get("/db-error", function (req, res) {
    throw new DbError(5555, "Integrity error")
    // non reachable code
});

// never called, except 404
app.use(function (req, res, next) {
    console.log("middleware last one begin");
    next()
    console.log("middleware last one end");
})

// wildcard, should be at last
app.get('*', function (req, res) {
    res.send('not found ', 404);
});

// specific error middleware
app.use(dbErrorMiddleware);

// GENERIC ERROR HANDLER, MUST BE AT END
// Error middleware, has 4 arguments
app.use(function (err, req, res, next) {
    console.log("Got error in execution ", err);
    //FIXME: Log the error
    res.status(500)
        .json({
            error: 'Internal Server error',
            message: err.message
        });
})


module.exports = app;
