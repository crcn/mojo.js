var Application = require("mojo-application");

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

module.exports = MojoApplication;