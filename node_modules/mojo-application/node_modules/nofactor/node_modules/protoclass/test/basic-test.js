var expect = require("expect.js"),
structr    = require("..");

describe("basic#", function() {

  
  it("can create a structr", function () {

    function Person(name) {
      this.name = name;
    }

    structr(Person);

    var person = new Person("craig");
    expect(person.name).to.be("craig");
  });


  it("can set methods to the class", function () {
    function Person (name) {
      this.name = name;
    }

    structr(Person, {
      getName: function () {
        return this.name;
      }
    });

    var p = new Person("craig");
    expect(p.getName).not.to.be(undefined);
    expect(p.getName()).to.be("craig");
  });

  it("can extend a value via structr", function () {

    function Person (name) {
      this.name = name;
    }

    function Architect (name) {
      Architect.superclass.apply(this, arguments);
    }

    structr(Person, Architect, {
      isArchitect: true
    });

    var architect = new Architect("craig");
    expect(architect.isArchitect).to.be(true);
    expect(architect.constructor).to.be(Architect);
    expect(architect.name).to.be("craig");
    expect(architect.constructor.__super__).to.be(Person.prototype);
    expect(architect.constructor.superclass).to.be(Person);
  });


  it("can extend via .extend()", function() {

    function Animal(name) {
      this.name = name;
    }

    function Cat(name) {
      Cat.superclass.apply(this, arguments);
    }

    structr(Animal, Cat, {
      meow: function() {
        return this.name + " meow";
      }
    });

    var cat = new Cat("sam");
    expect(cat.meow()).to.be("sam meow");
    expect(Cat.__super__).to.be(Animal.prototype);
  });


  it("can call super on a parent class", function() {

    function Animal(name) {
      this.name = name;
    }

    structr(Animal, {
      speak: function() {
        return this.name + " says...";
      }
    });

    function Cat(name) {
      Animal.call(this, name);
    }

    structr(Animal, Cat, {
      speak: function() {
        return Cat.__super__.speak.call(this) + " meow";
      }
    });

    function Kitten(name) {
      Cat.call(this, name);
    }

    Cat.extend(Kitten, {
      speak: function() {
        return Kitten.__super__.speak.call(this) + "!";
      }
    });

    var cat = new Cat("molly"),
    kitten  = new Kitten("arnold");

    expect(cat.speak()).to.be("molly says... meow");
    expect(kitten.speak()).to.be("arnold says... meow!");
  });

  it("doesn't strip existing methods", function () {
    function Animal () {

    }

    Animal.prototype.bark = function () {

    }

    var Animal2 = structr(Animal);

    expect(Animal.prototype.bark).to.be(Animal.prototype.bark);
    expect(Animal).to.be(Animal2);
  });


  it("calls super if the child doesn't", function () {

    function Animal () {
      this.name = "sapo";
    }

    structr(Animal);


    var Dog = Animal.extend({
      bark: function () {

      }
    });


    var dog = new Dog();
    expect(Dog).not.to.be(Animal);
    expect(dog.name).to.be("sapo");
  });

});