var expect = require("expect.js"),
mojo       = require("../.."),
bindable   = require("bindable"),
paperclip  = require("paperclip");

describe("components/list#", function () {


  var app = new mojo.Application();

  // - modelViewFactory
  // - map
  // - modelViewFactory
  // - source as array
  // - changing source
  // - parentNode undefined bug

  it("can sort a list", function () {

    var view = new mojo.View({
      paper: paperclip.compile(
        "{{ html: sections.items }}"
      )
    }, app).decorate({
      sections: {
        items: {
          type: "list",
          source: new bindable.Collection([{ _id: "craig", priority: 0 }, { _id: "john", priority: 1 }].map(function (obj) {
            return new bindable.Object(obj);
          })),
          modelViewClass: mojo.View.extend({
            paper: paperclip.compile("hello {{ model._id }} ")
          }),
          sort: function (a, b) {
            return a.get("model.priority") > b.get("model.priority") ? -1 : 1
          }
        }
      }
    });

    expect(view.render().toString()).to.be("hello john hello craig ")
  });

  return;
  it("can create a list", function () {

    var view = new mojo.View({}, app).decorate({
      sections: {
        items: {
          type: "list",
          modelViewFactory: function(){}
        }
      }
    });


    view.render();
    expect(view.get("sections.items").__isList).to.be(true);
  });

  it("can bind to a bindable.Collection obj", function () {

    var src, view = new mojo.View({}, app).decorate({
      sections: {
        items: {
          type: "list",
          source: src = new bindable.Collection([{ _id: "craig" }, { _id: "john" }].map(function(obj) {
            return new bindable.Object(obj);
          })),
          modelViewClass: mojo.View
        }
      }
    }), v1, v2;

    view.__decorators = undefined;

    view.render();


    view.get("sections.items").render();
    expect(view.get("sections.items.source")).to.be(src);
    expect((v1 = view.get("sections.items")._views.at(0)).get("model._id")).to.be("craig");
    expect(v1.section).not.to.be(undefined);
    expect(view.get("sections.items")._views.at(1).get("model._id")).to.be("john");

  });



  it("can dynamically create a view from modelViewFactory", function () {

    var view = new mojo.View({
      paper: paperclip.compile(
        "{{ html: sections.items }}"
      )
    }, app).decorate({
      sections: {
        items: {
          type: "list",
          source: new bindable.Collection([{ _id: "craig", priority: 0 }, { _id: "john", priority: 1 }].map(function(obj) {
            return new bindable.Object(obj);
          })),
          modelViewFactory: function (options) {
            options.paper = paperclip.compile("hello {{model._id}} ")
            return new mojo.View(options);
          }
        }
      }
    });

    expect(view.render().toString()).to.be("hello craig hello john ")

  });

  it("adds / removes items as the source changes", function () {
    var src,
    view = new mojo.View({
      paper: paperclip.compile(
        "{{ html: sections.items }}"
      )
    }, app).decorate({
      sections: {
        items: {
          type: "list",
          source: src = new bindable.Collection([{ _id: "craig", priority: 0 }, { _id: "john", priority: 1 }].map(function(obj) {
            return new bindable.Object(obj);
          })),
          modelViewFactory: function (options) {
            options.paper = paperclip.compile("hello {{model._id}} ")
            return new mojo.View(options);
          }
        }
      }
    });


    expect(view.render().toString()).to.be("hello craig hello john ");
    src.push(new bindable.Object({ _id: "jeff"}));
    expect(view.render().toString()).to.be("hello craig hello john hello jeff ");
    src.splice(0, 1);
    expect(view.render().toString()).to.be("hello john hello jeff ");

  });

  it("can sort a list", function () {

    var view = new mojo.View({
      paper: paperclip.compile(
        "{{ html: sections.items }}"
      )
    }, app).decorate({
      sections: {
        items: {
          type: "list",
          source: new bindable.Collection([{ _id: "craig", priority: 0 }, { _id: "john", priority: 1 }].map(function (obj) {
            return new bindable.Object(obj);
          })),
          modelViewClass: mojo.View.extend({
            paper: paperclip.compile("hello {{ model._id }} ")
          }),
          sort: function (a, b) {
            return a.get("model.priority") > b.get("model.priority") ? -1 : 1
          }
        }
      }
    });

    expect(view.render().toString()).to.be("hello john hello craig ")
  });


  // can resort a list if models change


  // it("can dynamically change the sort function on a list component", function () {
  //   // TODO
  // });


  it("can filter a list", function () {

    var view = new mojo.View({
      paper: paperclip.compile(
        "{{ html: sections.items }}"
      )
    }, app).decorate({
      sections: {
        items: {
          type: "list",
          source: new bindable.Collection([{ _id: "craig", priority: 1 }, { _id: "john", priority: 2 }, { _id: "frank", priority: 3 }].map(function (obj) {
            return new bindable.Object(obj);
          })),
          modelViewClass: mojo.View.extend({
            paper: paperclip.compile("hello {{ model._id }} ")
          }),
          filter: function (a) {
            return a.get("priority") % 2;
          }
        }
      }
    });

    expect(view.render().toString()).to.be("hello craig hello frank ");
  });
  


  it("re-filters a list if the models change", function () {
    var src = new bindable.Collection([{ _id: "craig", priority: 1 }, { _id: "john", priority: 2 }, { _id: "frank", priority: 3 }].map(function (obj) {
      return new bindable.Object(obj);
    }));

    var view = new mojo.View({
      paper: paperclip.compile(
        "{{ html: sections.items }}"
      )
    }, app).decorate({
      sections: {
        items: {
          type: "list",
          source: src,
          modelViewClass: mojo.View.extend({
            paper: paperclip.compile("hello {{ model._id }} ")
          }),
          filter: function (a) {
            return a.get("priority") % 2;
          }
        }
      }
    });

    expect(view.render().toString()).to.be("hello craig hello frank ");
    src.at(0).set("priority", 2);
    src.at(1).set("priority", 1);
    expect(view.render().toString()).to.be("hello frank hello john ");
    src.at(2).set("priority", 2);
    expect(view.render().toString()).to.be("hello john ");
  });


  it("can use a vanilla array as the source of a list", function () {
    // TODO
    var view = new mojo.View({
      paper: paperclip.compile(
        "{{ html: sections.items }}"
      )
    }, app).decorate({
      sections: {
        items: {
          type: "list",
          source: [{ _id: "craig", priority: 1 }, { _id: "john", priority: 2 }, { _id: "frank", priority: 3 }].map(function (obj) {
            return new bindable.Object(obj);
          }),
          modelViewClass: mojo.View.extend({
            paper: paperclip.compile("hello {{ model._id }} ")
          })
        }
      }
    });

    view.render();
  });


  it("can dynamically change the source", function () {

    var view = new mojo.View({
      paper: paperclip.compile(
        "{{ html: sections.items }}!"
      )
    }, app).decorate({
      sections: {
        items: {
          type: "list",
          modelViewClass: mojo.View.extend({
            paper: paperclip.compile("hello {{ model._id }} ")
          })
        }
      }
    });

    view.render();


    view.set("sections.items.source", [{ _id: "craig"}, { _id: "john"} ].map(function (v) {
      return new bindable.Object(v)
    }))
    expect(view.section.toString()).to.be("hello craig hello john !");
    view.set("sections.items.source", [{ _id: "jeff"}, { _id: "jake"}, { _id: "sam"} ].map(function (v) {
      return new bindable.Object(v)
    }));
    expect(view.section.toString()).to.be("hello jeff hello jake hello sam !");
  });



  it("can re-render a list", function () {
    var view = new mojo.View({
      paper: paperclip.compile(
        "{{ html: sections.items }}"
      )
    }, app).decorate({
      sections: {
        items: {
          type: "list",
          modelViewClass: function(){}
        }
      }
    }), list;

    view.render();
    (list = view.get("sections.items")).remove();
    list.render();
  })


  it("can re-use a list after it's been removed", function () {
    var view = new mojo.View({
      paper: paperclip.compile(
        "v - {{ html: sections.items }}"
      )
    }, app).decorate({
      sections: {
        items: {
          type: "list",
          source: [{ _id: "craig"}, { _id: "john"} ].map(function(v) { 
            return new bindable.Object(v);
          }),
          modelViewClass: mojo.View.extend({
            paper: paperclip.compile("hello {{ model._id }} ")
          })
        }
      }
    }), list;

    expect(view.render().toString()).to.be("v - hello craig hello john ");
    list = view.get("sections.items");
    expect(list.section.toString()).to.be("hello craig hello john ");
    list.remove();
    expect(view.section.toString()).to.be("v - ");
    list.render();
    expect(list.section.toString()).to.be("hello craig hello john ");
    expect(view.render().toString()).to.be("v - hello craig hello john ");
  });


  it("can map data", function () {
    var view = new mojo.View({
      paper: paperclip.compile(
        "{{ html: sections.items }}"
      )
    }, app).decorate({
      sections: {
        items: {
          type: "list",
          source: [{ _id: "craig"}, { _id: "john"} ],
          modelViewClass: mojo.View.extend({
            paper: paperclip.compile("hello {{ model.name }} ")
          }),
          map: function (item) {
            return new bindable.Object({
              _id: item._id,
              name: item._id.toUpperCase()
            })
          }
        }
      }
    });

    expect(view.render().toString()).to.be("hello CRAIG hello JOHN ")
  });

  it("can bind to a source string", function () {
    var view = new mojo.View({
      src: [{ _id: "craig"}, { _id: "john"} ].map(function(v) {
        return new bindable.Object(v);
      }),
      paper: paperclip.compile(
        "{{ html: sections.items }}"
      )
    }, app).decorate({
      sections: {
        items: {
          type: "list",
          source: "src",
          modelViewClass: mojo.View.extend({
            paper: paperclip.compile("hello {{ model._id }} ")
          })
        }
      }
    });

    expect(view.render().toString()).to.be("hello craig hello john ");
  });


  it("can dispose a list", function () {var view = new mojo.View({
      src: [{ _id: "craig"}, { _id: "john"} ].map(function(v) {
        return new bindable.Object(v)
      }),
      paper: paperclip.compile(
        "v {{ html: sections.items }}"
      )
    }, app).decorate({
      sections: {
        items: {
          type: "list",
          source: "src",
          modelViewClass: mojo.View.extend({
            paper: paperclip.compile("hello {{ model._id }} ")
          })
        }
      }
    });

    expect(view.render().toString()).to.be("v hello craig hello john ");
    view.get("sections.items").dispose();
    expect(view.render().toString()).to.be("v ");

  });

  /**
   */

  /*it("can dynamically change a filter", function () {
    // TODO
  });*/

  /**
   */

});