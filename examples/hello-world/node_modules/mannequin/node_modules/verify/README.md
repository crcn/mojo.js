```javascript

var verify = require("verify")();

verify.register("email", "Invalid email").is(/regexp/).len(6, 64);
verify.register("name", "Invalid name").len(2);
verify.register("phoneNumber", "Invalid phone number").sanitize(/\d+\-\d+\-\d+/, function(number) {
	return number.replace(/-/g, "");
})
verify.register("fullName", "Invalid full name").is("name");


//don't throw an error if validation 
verify.throwsError(false);

var options = {
	phoneNumber: "994-433-3444",
	email: "email@email.com",
	fullName: "Wu"
}


if(verify.that(options).has("email", "phoneNumber", "fullName").sanitize()) {
	console.log(options.phoneNumber); //994443344
}

```


### API

#### verify(options)
	
	- `throwsError` - TRUE if the validation library throws an error if one occurs

#### chain verify.register(name, message)
	
registers a new verifiable item

#### chain verify.get(name)

returns a validator chain that's already registered

### Chain API

#### chain.match(fnOrRegexp)

check against a given value

#### chain.sanitize(check, fn)

sanitizes the value based on the check. 
