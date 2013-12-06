var jsdom  = require("jsdom"),
nofactor   = require("nofactor"),
fs         = require("fs"),
mojo       = require("../..");

before(function (next) {
  jsdom.env(fs.readFileSync(__dirname + "/../helpers/doc.html", "utf8"), [ __dirname + "/../helpers/jquery.js"], function(err, window) {

    // trigger for some libs
    global.window = window;

    // set the document to global so that nofactor has access to it
    global.document = window.document;

    // make sure this is accessible in the application
    global.$ = window.$;

    next();
  });
});