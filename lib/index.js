var Application = require("mojo-application");

module.exports = Application.extend({
  registerPlugins: function () {
    // this.use(require("mojo-mediator"));
    // this.use(require("mojo-router"));
    this.use(require("mojo-views"));
    this.use(require("mojo-paperclip"));
  },
  didInitialize: function (options) {
    $(options.element).append(this.views.create("main").render());
  }
});