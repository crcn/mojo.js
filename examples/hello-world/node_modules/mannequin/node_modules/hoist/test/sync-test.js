var hoist = require("../"),
expect = require("expect.js"),
structr = require("structr");

describe("sync", function() {
  var numberCaster,
  arrayCaster,
  numberTransformer;

  var Person = structr({
    __construct: function(data) {
      this.data = data;
    }
  });


  it("can create a few casters", function() {
    numberCaster = hoist.cast(Number);
    arrayCaster = hoist.cast(Array);
    numberTransformer = numberCaster.map(function(value) {
      return { value: value };
    });
  });


  it("can properly type cast a number", function() {
    expect(hoist.cast(Number)("5")).to.be(5);
  });
  
  it("can properly type cast an array", function() {
    var result = hoist.cast(Array)("5");
    expect(result).to.be.an(Array);
    expect(result).to.contain("5");
  });

  it("can propertly run double casts", function() {
    var result = hoist.cast(Number).cast(Array)("5");

    expect(result).to.be.an(Array);
    expect(result).to.contain(5);
  });

  it("can properly map a value", function() {
    var result = hoist.cast(Number).map(function(value) { return { value: value } })("5");
    expect(result.value).to.be(5);
  });

  it("can cast a person", function() {
    var result = hoist.cast(Person)({ name: "craig" });
    expect(result).to.be.an(Person);
  });


  it("can pre-cast a person", function() {
    var result = hoist.postCast(Person).preMap(function(value){ return { name: value }; })("craig");
    expect(result).to.be.an(Person);
    expect(result.data.name).to.be("craig");
  })

  it("cannot re-cast a person", function() {
    var caster = hoist.cast(Person);
    var result = caster(caster({ name: "craig" }));
    expect(result.data).not.to.be.an(Person);
  });

  it("can pass a second param", function() {
    hoist.map(function(item, index) {
      expect(index).to.be(6);
    }).call(null, 5, 6);  
  })
})