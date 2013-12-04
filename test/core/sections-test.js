var expect = require("expect.js"),
mojo       = require("../..");


describe("core/sections#", function () {

  var app = new mojo.Application(), 
  app2 = new mojo.Application();
  app.registerViewClass("basic", mojo.View);
  app2.registerViewClass("basic", mojo.View);

  /*
  - registered component
  - class reference
  - custom component
  - createFragment set on view
  */

}); 