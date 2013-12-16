var expect = require("expect.js"),
mojo       = require("../.."),
bindable   = require("bindable"),
paperclip  = require("paperclip");


describe("components/states#", function () {


  var app = new mojo.Application(),
  helloTemplate = paperclip.compile("hello {{name}}"),
  pagesTemplate = paperclip.compile("page: {{html:sections.pages}}");

  // - render, remove, dispose

  it("can create a states view without any views", function () {
    new mojo.View({
      paper: pagesTemplate
    }, app).decorate({
      sections: {
        pages: {
          type: "states"
        }
      }
    }).render();
  });

  it("can create states without setting the index", function () {
    var view = new mojo.View({
      paper: pagesTemplate
    }, app).decorate({
      sections: {
        pages: {
          type: "states",
          views: [
            { class: mojo.View.extend({paper:helloTemplate, name: "page 1"}), name: "page1" }
          ]
        }
      }
    });

    view.render();
    expect(view.section.toString()).to.be("page: ");
    view.sections.pages.set("index", 0);
    expect(view.render().toString()).to.be("page: hello page 1");

  });

  describe("can create a states view with views", function () {
    var view = new mojo.View({
      paper: pagesTemplate
    }, app).decorate({
      sections: {
        pages: {
          type: "states",
          index: 0,
          views: [
            { class: mojo.View.extend({paper:helloTemplate, name: "page 1"}), name: "page1" },
            { class: mojo.View.extend({paper:helloTemplate, name: "page 2"}), name: "page2" }
          ]
        }
      }
    });

    it("and set the index", function() {
      expect(view.render().toString()).to.be("page: hello page 1");
      expect(view.sections.pages.currentView.get("name")).to.be("page 1");
      view.sections.pages.set("index", 1);
      expect(view.render().toString()).to.be("page: hello page 2");
      expect(view.sections.pages.currentView.get("name")).to.be("page 2");
    });

    it("and set the current name", function () {
      view.sections.pages.set("currentName", "page1");
      expect(view.render().toString()).to.be("page: hello page 1");
    });

    it("and cannot rotate pages if 'rotate' not set", function () {
      view.sections.pages.next();
      expect(view.render().toString()).to.be("page: hello page 2");
      view.sections.pages.next();
      expect(view.sections.pages.ended).to.be(true);
      expect(view.render().toString()).to.be("page: hello page 2");
    });

    it("and can rotate the pages", function () {
      view.sections.pages.rotate = true;
      view.sections.pages.next();
      expect(view.render().toString()).to.be("page: hello page 1");
    });

    it("and can call prev", function () {
      view.sections.pages.prev();
      expect(view.render().toString()).to.be("page: hello page 2");
      view.sections.pages.prev();
      expect(view.render().toString()).to.be("page: hello page 1");
    });

    it("and cannot call prev if rotate is false", function () {
      view.sections.pages.rotate = false;
      view.sections.pages.prev();
      expect(view.sections.pages.ended).to.be(true);
      expect(view.render().toString()).to.be("page: hello page 1");
    });

    it("can select a page", function () {
      view.sections.pages.source.at(0).select();
      expect(view.render().toString()).to.be("page: hello page 1");
      view.sections.pages.source.at(1).select();
      expect(view.render().toString()).to.be("page: hello page 2");
    });
  });

  it("can create a page with the viewClass prop", function () {
    var view = new mojo.View({
      paper: pagesTemplate
    }, app).decorate({
      sections: {
        pages: {
          type: "states",
          index: 0,
          views: [
            { viewClass: mojo.View.extend({paper:helloTemplate, name: "page 1"}), name: "page1" }
          ]
        }
      }
    });
    expect(view.render().toString()).to.be("page: hello page 1");
  });

  it("can create a page without options", function () {
    var view = new mojo.View({
      paper: pagesTemplate
    }, app).decorate({
      sections: {
        pages: {
          type: "states",
          index: 0,
          views: [
            mojo.View.extend({paper:helloTemplate, name: "page 1"})
          ]
        }
      }
    });
    expect(view.render().toString()).to.be("page: hello page 1");
  });


  it("can dynamically change the views", function () {

    var views1 = [
      { class: mojo.View.extend({paper:helloTemplate, name: "page 1"}), name: "page1" }
    ];

    var views2 = [
      { class: mojo.View.extend({paper:helloTemplate, name: "page 2"}), name: "page2" }
    ];

    var view = new mojo.View({
      paper: pagesTemplate
    }, app).decorate({
      sections: {
        pages: {
          type: "states",
          index: 0
        }
      }
    });

    view.render();
    view.sections.pages.set("views", views1);
    expect(view.section.toString()).to.be("page: hello page 1");
    view.sections.pages.set("views", views2);
    expect(view.section.toString()).to.be("page: hello page 2");
  });



});