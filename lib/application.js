var Application = require("mojo-application");

function MojoApplication () {
  Application.apply(this, arguments);
}

Application.extend(MojoApplication, {
  plugins: [

    // bootstraps the entire application
    require("mojo-bootstrap"),

    // HTTP router
    require("mojo-router"),

    // contains all the data for your application
    require("mojo-models"),

    // controls what is displayed to the user, and 
    // any user interactions
    require("mojo-views"),

    // template engine - what is rendered, and displayed
    // to the user
    require("mojo-paperclip"),

    // additional functionality
    require("./plugins")
  ]
});

module.exports = MojoApplication;
