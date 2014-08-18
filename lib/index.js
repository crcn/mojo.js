var MojoApplication = require("./application");

// register globals
require("zepto");
require("paperclip");
require("paperclip/lib/parser");
global.application = new MojoApplication();

// expose ns
module.exports = global.mojo = {
  Application : MojoApplication,
  views       : require("mojo-views"),
  models      : require("mojo-views")
};
