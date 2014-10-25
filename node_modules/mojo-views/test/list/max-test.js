var views = require("../.."),
expect    = require("expect.js"),
bindable  = require("bindable");

describe("list/max#", function () {

  var source = new bindable.Collection([
    new bindable.Object({ name: "a" }),
    new bindable.Object({ name: "b" })
  ]);

  return;

  var ItemView = views.Base.extend({
    didCreateSection: function () {
      this.section.append(this.application.nodeFactory.createTextNode(this.model.get("name") + ","));
    }
  });

});