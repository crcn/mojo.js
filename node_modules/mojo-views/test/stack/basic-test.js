var views = require("../.."),
expect    = require("expect.js");

describe("stack#", function () {

  it("can create a new stack view", function () {
    new views.Stack();
  });

  it("can set the state of a stack view", function () {

    var PagesView = views.Stack.extend({
      sections: {
        state1: views.Base.extend(),
        state2: views.Base.extend(),
      }
    });

    var p = new PagesView();
    p.render();
    p.set("state", "state1");
    expect(p.get("currentChild.name")).to.be("state1");
    p.set("state", "state2");
    expect(p.get("currentChild.name")).to.be("state2");
    p.set("state", "state1");
    expect(p.get("currentChild.name")).to.be("state1");
  });

  it("properly renders each state", function () {
    var PagesView = views.Stack.extend({
      sections: {
        state1: views.Base.extend({
          didCreateSection: function () {
            this.section.append(this.application.nodeFactory.createTextNode("state1"))
          }
        }),
        state2: views.Base.extend({
          didCreateSection: function () {
            this.section.append(this.application.nodeFactory.createTextNode("state2"));
          }
        })
      }
    });

    var p = new PagesView();
    p.render();
    p.set("state", "state1");
    expect(p.section.toString()).to.be("state1");
    p.set("state", "state2");
    expect(p.section.toString()).to.be("state2");
    p.set("state", "state1");
    expect(p.section.toString()).to.be("state1");
  });

  it("can bind states to control the current state", function () {

    var PagesView = views.Stack.extend({
      name: "main",
      sections: {
        state1: views.Base.extend({
          didCreateSection: function () {
            this.section.append(this.application.nodeFactory.createTextNode("state1"))
          }
        }),
        state2: views.Base.extend({
          didCreateSection: function () {
            this.section.append(this.application.nodeFactory.createTextNode("state2"));
          }
        })
      }
    });

    var pages = new PagesView();
    pages.render();
    pages.set("states", {
      main: "state1"
    });

    expect(pages.get("currentChild.name")).to.be("state1");

    pages.set("states", {
      main: "state2"
    });


    expect(pages.get("currentChild.name")).to.be("state2");


    pages.set("name", "main2");

    pages.set("states", {
      main: "state1"
    });

    expect(pages.get("currentChild.name")).to.be("state2");

    pages.set("states", {
      main2: "state1"
    });

    expect(pages.get("currentChild.name")).to.be("state1");

  });

  it("throws an error if a state doesn't exist", function () {
    var PagesView = views.Stack.extend({
      name: "main",
      sections: {
        state1: views.Base.extend({
          didCreateSection: function () {
            this.section.append(this.application.nodeFactory.createTextNode("state1"))
          }
        }),
        state2: views.Base.extend({
          didCreateSection: function () {
            this.section.append(this.application.nodeFactory.createTextNode("state2"));
          }
        })
      }
    });

    var pages = new PagesView();
    pages.render();

    try {
      pages.set("state", "state99");
    } catch (e) {
      expect(e.message).to.be("state 'state99' does not exist");
    }
  });

  it("doesn't set the state if state is undefined", function () {
    var PagesView = views.Stack.extend({
      name: "main",
      sections: {
        state1: views.Base.extend({
          didCreateSection: function () {
            this.section.append(this.application.nodeFactory.createTextNode("state1"))
          }
        }),
        state2: views.Base.extend({
          didCreateSection: function () {
            this.section.append(this.application.nodeFactory.createTextNode("state2"));
          }
        })
      }
    });

    var pages = new PagesView();
    pages.render();
    pages.set("state", "state1");
    expect(pages.get("currentChild.name")).to.be("state1");
    pages.set("state", void 0);
    expect(pages.get("currentChild.name")).to.be("state1");
  });

  it("can create a stack view from a sections property", function () {

    var PagesView = views.Base.extend({
      didRender: function () {
        this.section.append(this.get("sections.pages").render());
      },
      sections: {
        pages: {
          type: "stack",
          sections: {
            state1: views.Base.extend({
              didCreateSection: function () {
                this.section.append(this.application.nodeFactory.createTextNode("state1"))
              }
            }),
            state2: views.Base.extend({
              didCreateSection: function () {
                this.section.append(this.application.nodeFactory.createTextNode("state2"));
              }
            })
          }
        }
      }
    });

    var pages = new PagesView();
    var tpl = pages.render();
    pages.set("states", { pages: "state1" });
    expect(tpl.toString()).to.be("state1");
    pages.set("states", { pages: "state2" });
    expect(tpl.toString()).to.be("state2");
    pages.set("states", { pages: "state1" });
    expect(tpl.toString()).to.be("state1");
  });
});
