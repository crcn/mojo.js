class ClassFactory extends require("./base")

  ###
  ###

  constructor: (@clazz) ->
  
  ###
  ###

  create: (data) -> new @clazz data

  ###
  ###

  test: (data) -> @clazz.test data


module.exports = (clazz) -> new ClassFactory clazz