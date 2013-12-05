return;
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
    }), removed;

    p.setChild("child", c);

    p.render();




    expect(p.section.toString()).to.be("<div></div>");
    p.set("showElement", true);
    expect(p.section.toString()).to.be("<div>Hello Craig</div>");

    // make sure remove is called
    c.once("remove", function() {
      removed = true;
    });

    // make element invisible again
    p.set("showElement", false);

    expect(removed).to.be(true);

    c.once("render", function () {
      removed = false;
    });

    expect(p.section.toString()).to.be("<div></div>");
    p.set("showElement", true);
    expect(removed).to.be(false);
    expect(p.section.toString()).to.be("<div>Hello Craig</div>");
  });

  return;

  /**
   */

  it("works with sub-views", function () {

    var tpl, p = new mojo.View({
      paper: tpl = paperclip.compile(
        "<div>" + 
          "{{#if:showChild}}" + 
            "{{ html: sections.child }}" + 
          "{{/}}" + 
        "</div>"
      )
    }, app),
    p2 = new mojo.View({
      paper: tpl
    }),
    c = new mojo.View({
      name: "Craig",
      paper: paperclip.compile("Hello {{name}}")
    });

    p2.setChild("child", c);
    p.setChild("child", p2);

    p.render();

    console.log(p.section.toString())
  })
});

