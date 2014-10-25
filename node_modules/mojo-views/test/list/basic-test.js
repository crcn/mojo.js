var views = require("../.."),
expect    = require("expect.js"),
bindable  = require("bindable"),
sinon     = require("sinon");



describe("list/basic#", function () {

  var source;

  beforeEach(function() {
    source = new bindable.Collection([
      new bindable.Object({ name: "a" }),
      new bindable.Object({ name: "b" })
    ]);
  });

  var ItemView = views.Base.extend({
    didCreateSection: function () {
      this.section.append(this.application.nodeFactory.createTextNode(this.model.name + ","));
    }
  });

  it("can create a new list view", function () {
    new views.List();
  });

  it("render a list of children using modelViewClass", function () {

    var list = new views.List({
      source: source,
      modelViewClass: ItemView
    });

    expect(list.render().toString()).to.be("a,b,");
  });


  it("render a list of children using modelViewFactory", function () {

    var list = new views.List({
      source: source,
      modelViewFactory: function (options) {
        expect(options.model.get("name")).not.to.be(void 0);
        return new ItemView(options);
      }
    });

    expect(list.render().toString()).to.be("a,b,");
  });


  it("can dynamically render new items added to a list", function () {

    var list = new views.List({
      source: source,
      modelViewClass: ItemView
    });

    expect(list.render().toString()).to.be("a,b,");
    source.push(new bindable.Object({ name: "c" }));
    expect(list.render().toString()).to.be("a,b,c,");
  });

  it("can dynamically remove items from a list", function () {

    var list = new views.List({
      source: source,
      modelViewClass: ItemView
    });

    expect(list.render().toString()).to.be("a,b,");
    source.splice(1, 1);
    expect(list.render().toString()).to.be("a,");
  });


  it("stops listening to a model if it's removed", function () {

    var list = new views.List({
      source: source,
      modelViewClass: ItemView
    });

    list.render();

    var item = source.at(0);
    source.splice(0, 1);

    var spy = sinon.spy(list, "_onFilterChange");

    item.set("name", "d");
    expect(spy.callCount).to.be(0);

  });

  it("can dynamically change a source", function () {

    var list = new views.List({
      source: source,
      modelViewClass: ItemView
    });

    expect(list.render().toString()).to.be("a,b,");
    list.set("source", new bindable.Collection([
      new bindable.Object({ name: "c" }),
      new bindable.Object({ name: "d" })
    ]));
    expect(list.render().toString()).to.be("c,d,");
  });

  it("removes all listeners on a source when it's been replaced", function () {

    var oldSource;
    var list = new views.List({
      source: oldSource = source,
      modelViewClass: ItemView
    });
    list.render();

    expect(list.render().toString()).to.be("a,b,");
    list.set("source", new bindable.Collection([
      new bindable.Object({ name: "c" }),
      new bindable.Object({ name: "d" })
    ]));
    expect(list.render().toString()).to.be("c,d,");

    var spy = sinon.spy(list, "_onFilterChange"),
    spy2    = sinon.spy(list, "_onSourceUpdate");

    oldSource.splice(1,1);
    expect(spy2.callCount).to.be(0);
    expect(spy.callCount).to.be(0);
  });

  it("can re-render a list", function () {
    var list = new views.List({
      source: source,
      modelViewClass: ItemView
    });

    expect(list.render().toString()).to.be("a,b,");
    list.remove();
    expect(list.render().toString()).to.be("a,b,");
  });

  it("doesn't require bindable collection for the source", function () {

    var list = new views.List({
      src: [{name:"a"},{name:"b"}],
      source: "src",
      modelViewClass: ItemView
    });

    expect(list.render().toString()).to.be("a,b,");
  });

  it("can bind to a source property", function () {
    var list = new views.List({
      src: source,
      source: "src",
      modelViewClass: ItemView
    });

    expect(list.render().toString()).to.be("a,b,");

    list.set("src", new bindable.Collection([
      new bindable.Object({ name: "c" }),
      new bindable.Object({ name: "d" })
    ]));

    expect(list.render().toString()).to.be("c,d,");
  });

  it("can set the source to undefined", function () {
    var list = new views.List({
      src: source,
      source: "src",
      modelViewClass: ItemView
    });
    expect(list.render().toString()).to.be("a,b,");
    list.set("source", void 0);
    expect(list.render().toString()).to.be("");
    list.set("source", [{ name: "c" },{name:"d"}]);
    expect(list.render().toString()).to.be("c,d,");
  })

});