var verify = require("../"),
expect = require("expect.js")

describe("verify", function() {

  var v;

  it("can register validators", function() {
    v = verify();
    v.register("name", "Invalid name").len(2);
    v.register("phoneNumber", "Invalid phone number").sanitize(/\d+\-\d+\-\d+/, function(number) {
        return number.replace(/-/g, "");
    })
    v.register("fullName", "Invalid full name").is("name");

    v.register("test").match({
      is: /regexp/,
      len: [6, 64]
    });
  });

  it("can verify that an email is valid", function() {
    expect(v.that({ email: "craig.j.condon@gmail.com" }).has("email").errors.length).to.be(0)
    expect(v.that({ email: "craig.j.condon+hashbang@gmail.com" }).has("email").errors.length).to.be(0)
  });


  it("can verify that an email is invalid", function() {
    expect(v.that({ email: "email" }).has("email").errors.length).to.be(1)
  });


  it("can create a tester", function() {
    expect(v.tester().is("email").test("craig.j.condon@gmail.com")).to.be(true);
  });
})