
//should use verify.js for the schema mappings

```javascript
var schema = new Schema({
  name: "String",
  last: "String",
  email: "Email"
});


//ability to register custom data types - 
Schema.verifier.register("tacos").is("email");

schema.validate({
  name: "craig",
  email: "fdsnkflsdfnskdl"
}).errors; //email is invalid


var model = new Model();


//pre-hook save so it can be saved into the backend
model.pre("save", function(next) {
  delegate.save(model.get(), next);
});

model.save(function() {
  
});

```