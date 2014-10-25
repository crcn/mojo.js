### Mediocre.js [![Alt ci](https://travis-ci.org/classdojo/mediocre.js.png)](https://travis-ci.org/classdojo/mediocre.js)

Mediocre is a lightweight JavaScript mediator.

### Features

- ability to add pre / post hooks
- ability to call commands with options (see below)

```javascript
var mediator = require("mediocre")();

mediator.on("validate", function (message, next) {
    for(var param in message.options) {
      //validate fields against message.data
    }
});

//login helper
mediator.on("login", function (message, next) {
  console.log(message.data);
});


//add pre-hook into login to validate fields
mediator.on("pre login", { validate: { username: "string", password: "string" }});


// spy on a message being executed
mediator.spy({ redirect: /.*?/ }, function (message, listeners) {
  message.once("success", function () {

  });
});

```


## API

### mediator.on(event, listeners...)

adds a listener

### mediator.execute(listener[, data][, callback])

executes a command

### message mediator.message(name[, data][, options])

creates a new message option to dispatch

```javascript
mediator.on("hello", function(message, options) {
  console.log(message.options.message); // world!
});

mediator.on("sayHelloWorld", { hello: { message: "world!" }});

//executes hello with options world
mediator.execute(mediator.message("hello", null, { message: "world!" }));

//same as above command
mediator.execute("sayHelloWorld");
```
