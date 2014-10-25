var noselector = require(".."),
expect         = require("expect.js"),
nofactor       = require("nofactor"),
pc             = require("paperclip");

describe("noselector#", function () {

  var nofactory = nofactor.string;

  describe("basic", function () {
    it("can wrap an element around a selector", function () {
      noselector(pc.template("<div />").bind().render());
    });

    it("has the right number of elements in a selector", function () {
      expect(noselector(pc.template("<div />").bind().render().childNodes).length).to.be(3);
    });

    it("can pluck an element based on the index", function () {
      var element = pc.template("<div class='abba baab' /><div class='bbbb' />").bind().render();
      expect(noselector(element).find("div").eq(1).attr("class")).to.be("bbbb");
    });

    xit("can pluck just the text out");
  });

  describe("query", function () {
    it("can find an element based on the name", function () {
      var element = pc.template("<div name='abba' /><div /><div><div /></div>").bind().render();
      expect(noselector(element).find("div").length).to.be(4);
    });

    it("can find an element based on the id", function () {
      var element = pc.template("<div id='abba' /><div />").bind().render();
      expect(noselector(element).find("#abba").length).to.be(1);
    });

    it("can find an element based on a class", function () {
      var element = pc.template("<div class='abba baab' /><div />").bind().render();
      expect(noselector(element).find(".baab").length).to.be(1);
    });

    it("can find a nested elemented", function () {
      var element = pc.template(
        "<li name='abba'>" +
          "<input />" +
          "<label>abba</label>" +
          "<button></button>" +
        "</li>"
      ).bind().render();

      expect(noselector(element).find("button").andSelf().filter("button").length).to.be(1);
    })
  });

  describe("attributes", function () {
    it("can set an attribute value", function () {
      var element = pc.template("<div><div /></div>").bind().render();
      noselector(element).find("div").attr("name", "abba");
      expect(element.toString()).to.be('<div name="abba"><div name="abba"></div></div>');
    });
  });

  describe("css", function () {
    it("can be set to the node", function () {
      var element = pc.template("<div><div /></div>").bind().render();
      expect(element.toString()).to.be('<div><div></div></div>');
      noselector(element).find("div").css({ "color": "red" });
      expect(element.toString()).to.be('<div style="color:red;"><div style="color:red;"></div></div>');
    });
  });

  describe("events", function () {
    it("can bind an event", function () {
      var element = pc.template("<div><div /></div>").bind().render();
      noselector(element).bind("event", function(){});
    });

    it("can trigger an event", function (next) {
      var element = pc.template("<div><div /></div>").bind().render();
      noselector(element).bind("event", function(){
        next();
      }).trigger("event");
    });

    it("can unbind an event", function () {
      var i = 0;
      var element = pc.template("<div><div /></div>").bind().render(), listener = function () {
        i++
      }
      noselector(element).bind("event", listener).unbind("event", listener).trigger("event");
      expect(i).to.be(0)
    });
  });


});
