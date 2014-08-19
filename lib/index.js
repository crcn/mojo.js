var MojoApplication = require("./application"),
bindable            = require("bindable");

// register globals
require("zepto");
require("paperclip");
require("paperclip/lib/parser");
global.application = new MojoApplication();

// expose ns
module.exports = global.mojo = {
  Application : MojoApplication,
  Object      : bindable.Object,
  Collection  : bindable.Collection,
  views       : require("mojo-views"),
  models      : require("mojo-views")
};
