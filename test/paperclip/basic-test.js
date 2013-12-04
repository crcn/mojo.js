var expect = require("expect.js"),
mojo       = require("../.."),
bindable   = require("bindable"),
paperclip  = require("paperclip"),
nofactor   = require("nofactor");

describe("paperclip/basic#", function () {

  var app;

  before(function () {
    app = new mojo.Application({ nodeFactory: nofactor.dom, $: $ });
  });
  /**
   */

  it("can assign a paperclip template to a view controller", function () {

    var view = new mojo.View({
      paper: paperclip.compile("Hello World")
    }, app);

    expect(view.section.toString()).to.be("#text#text");
    view.render(function () {
    console.log(view.section.toString(), "F")
    })

  });
});