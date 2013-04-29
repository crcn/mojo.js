
###
 Schema definition
###

hobbySchema = new Schema

  name: "string",
  type: "string"







personSchema = new Schema
  
  name: {
    first: "string",
    last: "string"
  },

  phoneNumber: {
    $type: "string",
    $required: true
  },

  createdAt: {
    $type: "date",
    $default: Date.now
  },

  hobbies: ["hobbies"]





dictionary = new Dictionary();

dictionary.register("hobbies", hobbySchema)
dictionary.register("people", personSchema)

PersonModel = dictionary.getModelClass("people")
HobbyModel = dictionary.getModelClass("hobbies")


PersonModel.pre("save", (next) ->

)


###
 create the server
###

person = new Person({
  name: {
    first: "craig",
    last: "string"
  }
});


person.validate (error) ->
  console.log(error); //phone number must be present



