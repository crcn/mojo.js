mannequin.js
============

model / schema library for javascript

```javascript
var mannequin = require("mannequin"),
dictionary = mannequin.dictionary();


dictionary.on("modelBuilder", function(modelBuilder) {
  modelBuilder.pre(["save", "remove"], function(next) {
    this.validate(next);
  });

  modelBuilder.pre("save", function(next) {
    if(this.isNew) {
      //insert
    } else {
      //update
    }
  });

  modelBuilder.pre("remove", function(next) {
    //remove it
    next();
  });

}).virtual("name").get(function() {
  return this.get("name.first") + " " + this.get("name.last");
}).set(function(value) {
  var nameParts = value.split(" ");
  this.set("name.first", nameParts[0]);
  this.set("name.last", nameParts[1]);
})

var LocationModel = dictionary.register("location", {
  name: "string",
  state: "string",
  zip: { $type: "string", $is: /\d{5}/ }
}).getClass();

var PersonModel = dictionary.register("person", {
  name: {
    first: "string",
    last: "string"
  },
  email: { 
    $type: "email",
    $required: true
  },
  location: "location",
  createdAt: {
    $type: "date",
    $default: Date.now
  }
}).getClass();
```