var MojoApplication = require("./application"),
bindable            = require("bindable"),
BaseApplication     = require("mojo-application");

if (process.browser) {
  require("./includes");
}

// default template engine
require("paperclip");

// paperclip template parser - registered as a global
require("paperclip/lib/parser");
global.application = BaseApplication.main = new MojoApplication();

// expose ns
module.exports = global.mojo = {
  application : global.application,
  Application : MojoApplication,
  Object      : bindable.Object,
  Collection  : bindable.Collection,
  views       : require("mojo-views"),
  models      : require("mojo-models")
};
