var models = require("./helpers/models"),
HobbyModel = models.HobbyModel,
PersonModel = models.PersonModel,
LocationModel = models.LocationModel,
fixture = require("./helpers/fixture"),
expect = require("expect.js");

describe("models", function() {


  var person, location;

  it("can create a model", function() {
    person = new PersonModel(fixture);
  });

  it("has a schema", function() {
    expect(person.schema).not.to.be(undefined);
  })

  it("can validate a model successfuly", function(next) {
    person.validate(next);
  });

  it("can set the location zip", function() {
    person.set("location.zip", "4355");
    expect(person.get("location.zip")).to.be("4355");
  });

  it("can validate the location zip", function(next) {
    person.validate(function(err) {
      expect(err).not.to.be(undefined);
      expect(err.message).to.contain("location");
      next();
    });
  });

  it("can reset the zip and succeed", function(next) {
    person.set("location.zip", "90222");
    person.validate(next);
  });

  it("cannot set the person color to be blank and be valid", function(next) {
    person.set("color", "");
    person.validate(function(err) {
      person.set("color", "blue");
      expect(err).not.to.be(null);
      next();
    })
  });

  it("location is type casted as a location model", function() {
    expect(person.get("location").builder.name).to.be("location");
  });

  it("hobbies should be a bindable collection", function() {
    expect(person.get("hobbies").at).not.to.be(undefined);
  });

  it("hobbies collection shoud have ref to the person item", function() {
    expect(person.get("hobbies").parent).to.be(person);
  });

  it("each hobby item should have a reference to the hobbies collection", function() {
    expect(person.get("hobbies").at(0).parent).to.be(person.get("hobbies"));
  });

  it("hobbies should be custom collection", function() {
    expect(person.get("hobbies").customCollection).to.be(true);
  });


  it("first item in hobbies should be a hobby", function() {
    expect(person.get("hobbies").at(0).constructor).to.be(HobbyModel)
  });

  it("when setting hobbies, to undefined, they're automatically filled", function() {
    person.set("hobbies", undefined);
    expect(person.get("hobbies").length()).to.be(0);
  });

  it("when resetting the hobbies, they're type-casted as a collection", function() {
    person.set("hobbies", [{_id:"blah", name:"blah"}]);
    expect(person.get("hobbies").at).not.to.be(undefined);
  });

  it("person hobbies has one item", function() {
    expect(person.get("hobbies").length()).to.be(1);
  });

  it("person hobbies has blah", function() {
    expect(person.get("hobbies").at(0).get("name")).to.be("blah")
  });

  it("person has a virtual name", function() {
    expect(person.get("fullName")).to.be("Craig Condon");
  });

  it("person can set a virtual name", function() {
    person.set("fullName", "Chris Frank");
    expect(person.get("fullName")).to.be("Chris Frank");
    expect(person.get("name.first")).to.be("Chris");
    expect(person.get("name.last")).to.be("Frank");
  });

  it("can bind to the virtual name", function() {
    var fullName;
    var binding = person.bind("fullName").to(function(name) {
      fullName = name;
    });

    person.set("name.last", "Awesome");
    binding.dispose()

    expect(fullName).to.be("Chris Awesome");
  })

  it("sub model has a virtual method", function() {
    expect(person.get("hobbies").at(0).get("test")).to.be("blah")
  });

  it("person has a save method", function() {
    expect(person.save).not.to.be(undefined);
  });


  it("person can be saved & activate pre & post hooks", function(next) {
    person.save(function() {
      expect(person.get("saveCount")).to.be(4);
      next();
    });
  });


  it("person has maintained the same method with pre hooks", function(next) {
    person.remove(function() {
      expect(person.get("removeCount")).to.be(1);
      next();
    });
  });

  it("person can find a hobby model", function() {
    expect(person.model("hobby")).not.to.be(undefined);
  });

  it("person schema has a definition", function() {
    expect(person.schema.getDefinition("name.first")).not.to.be(undefined);
  });

  it("person schema can be converted to JSON and not have properties that aren't defined in the schema", function() {
    person.set("fish", "sauce")
    expect(person.get("fish")).to.be("sauce");
    var obj = JSON.parse(JSON.stringify(person));
    expect(obj.fish).to.be(undefined);
  });

  it("person hobbies can be converted to JSON and not contain props not defined in schema", function() {
    var hobby = person.get("hobbies").at(0);
    hobby.set("fish", "cakes");
    expect(hobby.get("fish")).to.be("cakes");
    var obj = JSON.parse(JSON.stringify(person));
    expect(obj.hobbies[0].fish).to.be(undefined);
  });
});