
var Schema = require("../../").Schema,
bindable = require("bindable"),
dictionary = require("../../").dictionary();

var locationSchema = new Schema({
  "public name": "string",
  "public state": "string",
  "public zip": { $type: "string", $is: /\d{5}/ }
});

var hobbySchema = new Schema({
  "name": { $type: "string", $required: true },
  "type": { $type: "string", $default: "sport" }
})


var personSchema = new Schema({
  name: {
    first: "string",
    last: "string"
  },
  color: {
    $type: "string",
    $required: true
  },
  email: { 
    $type: "email",
    $required: true
  },
  location: { $ref: "location" },
  createdAt: {
    $type: "date",
    $default: Date.now
  },
  hobbies: [ { $ref: "hobby" } ]
});


exports.LocationModel = dictionary.register("location", locationSchema).getClass();
exports.HobbyModel    = dictionary.register("hobby", hobbySchema).getClass();
exports.PersonModel   = dictionary.register("person", personSchema).getClass();

exports.PersonModel.builder.virtual("fullName").get(function() {
  return this.get("name.first") + " " + this.get("name.last")
}).set(function(value) {
  var nameParts = value.split(" ");
  this.set("name.first", nameParts[0]);
  this.set("name.last", nameParts[1]);
}).bind("name.first", "name.last", "name")


exports.HobbyModel.builder.virtual("test").get(function() {
  return this.get("name");
});

exports.PersonModel.builder.createCollection = function() {
  var col = new bindable.Collection();
  col.customCollection = true;
  col.transform().map(function(item) {
    col.mapped = true;
    return item;
  })
  return col;
}

exports.PersonModel.builder.pre("save", function(next) {
  this.set("saveCount", 1);
  this.validate(next);
});

exports.PersonModel.builder.pre("save", function(next) {
  this.set("saveCount", this.get("saveCount") + 1);
  next();
});

exports.PersonModel.builder.post("save", function(next) {
  this.set("saveCount", this.get("saveCount") + 1);
  next();
});

exports.PersonModel.builder.post("save", function(next) {
  this.set("saveCount", this.get("saveCount") + 1);
  next();
});

exports.PersonModel.builder.methods.remove = function(next) {
  this.set("removeCount", 0);
  next();
}

exports.PersonModel.builder.post("remove", function(next) {
  this.set("removeCount", this.get("removeCount") + 1);
  next();
});


