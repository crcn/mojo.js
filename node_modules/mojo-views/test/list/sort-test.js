var views = require("../.."),
expect    = require("expect.js"),
bindable  = require("bindable");

describe("list/sort#", function () {

  var source;

  beforeEach(function() {
    source = new bindable.Collection([
      new bindable.Object({ priority: 0 }),
      new bindable.Object({ priority: 1 }),
      new bindable.Object({ priority: 2 }),
      new bindable.Object({ priority: 3 })
    ]);
  });

  var ItemView = views.Base.extend({
    didCreateSection: function () {
      this.section.append(this.application.nodeFactory.createTextNode(this.model.get("priority") + ","));
    }
  });

  it("can sort a list", function () {

    var list = new views.List({
      source: source,
      sort: function (a, b) {
        return a.get("priority") > b.get("priority") ? -1 : 1;
      },
      modelViewClass: ItemView
    });

    expect(list.render().toString()).to.be("3,2,1,0,");
  });

  it("sorts a newly created item", function () { 
    var list = new views.List({
      source: source,
      sort: function (a, b) {
        return a.get("priority") > b.get("priority") ? -1 : 1;
      },
      modelViewClass: ItemView
    });

    expect(list.render().toString()).to.be("3,2,1,0,");
    source.push(new bindable.Object({ priority: 2.5 }));
    expect(list.render().toString()).to.be("3,2.5,2,1,0,");
    source.push(new bindable.Object({ priority: 4 }));
    expect(list.render().toString()).to.be("4,3,2.5,2,1,0,");
    source.push(new bindable.Object({ priority: -1 }));
    expect(list.render().toString()).to.be("4,3,2.5,2,1,0,-1,");
  });

  it("resorts a list when the source changes", function () { 
    var list = new views.List({
      source: source,
      sort: function (a, b) {
        return a.get("priority") > b.get("priority") ? -1 : 1;
      },
      modelViewClass: ItemView
    });

    expect(list.render().toString()).to.be("3,2,1,0,");

    list.set("source", new bindable.Collection([
      new bindable.Object({ priority: 5 }),
      new bindable.Object({ priority: 4 }),
      new bindable.Object({ priority: 6 })
    ]));

    expect(list.render().toString()).to.be("6,5,4,");
  });

  it("resorts a list when a property on the model changes", function () {
    var list = new views.List({
      source: source,
      sort: function (a, b) {
        return a.get("priority") > b.get("priority") ? -1 : 1;
      },
      modelViewClass: ItemView
    });

    expect(list.render().toString()).to.be("3,2,1,0,");
    source.at(0).set("priority", 99);
    expect(list.render().toString()).to.be("0,3,2,1,");
    source.at(1).set("priority", 99);
    expect(list.render().toString()).to.be("1,0,3,2,");
  });

  it("resorts a list when the sort function changes", function () { });

  it("can toggle sources", function () {

    var GroupView = views.Base.extend({
      didCreateSection: function () {
        this.section.append(this.application.nodeFactory.createTextNode(this.model.get("g") + ","));
      }
    });

    var sa = new bindable.Collection([
      new bindable.Object({ g: "a" }),
      new bindable.Object({ g: "a" }),
      new bindable.Object({ g: "a" }),
      new bindable.Object({ g: "a" })
    ]);

    var sb = new bindable.Collection([
      new bindable.Object({ g: "b" }),
      new bindable.Object({ g: "b" }),
    ]);

    var list = new views.List({
      source: sa,
      modelViewClass: GroupView,
      sort: function (a, b) {
        return -1;
      },
      filter: function (a) {
        return true;
      }
    });

    expect(list.render().toString()).to.be("a,a,a,a,");
    list.set("source", sb);
    expect(list.section.toString()).to.be("b,b,");
    list.remove();
    list.set("visible", false);
    list.set("source", sa);
    expect(list.section.toString()).to.be("a,a,a,a,");

  });
});