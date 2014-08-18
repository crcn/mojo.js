var Application = require("mojo-application");
require("paperclip");
require("paperclip/lib/parser");

function MojoApplication () {
  Application.apply(this, arguments);
}

Application.extend(MojoApplication, {
  plugins: [
    require("mojo-bootstrap"),
    require("mojo-router"),
    require("mojo-models"),
    require("mojo-views"),
    require("mojo-paperclip")
  ],
  didBootstrap: function (options) {
    // override me
  }
});

module.exports = global.mojo = {
  Application : MojoApplication,
  views       : require("mojo-views"),
  models      : require("mojo-views")
};