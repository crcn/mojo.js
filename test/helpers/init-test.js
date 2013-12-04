var jsdom      = require("jsdom"),
nofactor   = require("nofactor"),
fs         = require("fs");


// create's a tiny shim so that mojo.js uses JSDOM. This allows for other fancy stuff

before(function (next) {


  jsdom.env(fs.readFileSync(__dirname + "/../helpers/doc.html", "utf8"), [ __dirname + "/../helpers/jquery.js"], function(err, window) {

    // override default DOM factory - use jsdom instead
    nofactor.default = nofactor.dom;

    // set the document to global so that nofactor has access to it
    global.document = window.document;

    // make sure this is accessible in the application
    global.$ = window.$;

    next();
  });
});