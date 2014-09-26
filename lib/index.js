var MojoApplication = require("./application"),
bindable            = require("bindable"),
Inject              = require("inject");

// browser includes
if (process.browser) {
  require("./includes");
  require("./inject");
}

// default template engine
require("paperclip");

// paperclip template parser - registered as a global
require("paperclip/lib/parser");
global.application = new MojoApplication();

// expose ns
module.exports = global.mojo = {
  application : global.application,
  Application : MojoApplication,
  Object      : bindable.Object,
  Collection  : bindable.Collection,
  views       : require("mojo-views"),
  models      : require("mojo-models")
};
