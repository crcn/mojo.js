var expect  = require("expect.js"),
mojo        = require("../.."),
bindable    = require("bindable"),
nodeFactory = require("nofactor"),
paperclip   = require("paperclip");

describe("paperclip/conditional#", function () {

  var app;

  before(function() {
    app = new mojo.Application({ nodeFactory: nodeFactory.dom })
  });


  // can toggle 
  /**
   */

  it("can toggle conditional and still show view", function () {
    var p = new mojo.View({
      paper: paperclip.compile(
        "<div>" +
          "{{#if: showElement }}" + 
            "{{ html: sections.child }}" +
          "{{/}}" +
        "</div>"
      )
    }, app),
    c = new mojo.View({
      name: "Craig",
      paper: paperclip.compile("Hello {{name}}")
    });

    p.setChild("child", c);

    // p.render();
    c.render();

    console.log(p.section.toString())
  })

});