var verify = require("../")();

verify.register("email2").is("email").len(10);
verify.register("name").len(2);


var success = verify.check({
	email: "me@email.com",
	name: "craig"
}).onError(function(error) {
	console.error(error)
}).has("email", "name").
success;

console.log(success)
