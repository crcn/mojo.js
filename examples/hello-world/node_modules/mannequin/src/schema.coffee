utils = require "./utils"
async = require "async"
PropertyDefinition = require "./propertyDefinition"

module.exports = class Schema

  ###
  ###

  __isSchema: true

  ###
  ###

  constructor: (@definition, @options) ->
    @_definitionsByKey = {}
    @build()

  ###
   validates an object against all definitions
  ###

  test: (target, next) ->
    async.forEach @definitions, ((definition, next) ->
      definition.test target, next
    ), next


  ###
  ###

  hasDefinition: () -> !!@_definitionsByKey[key]

  ###
  ###

  getDefinition: (key) -> @_definitionsByKey[key]

  ###
  ###

  refs: () ->

    refs = []
    for def in @definitions
      if def.options.$ref
        refs.push def

    refs

  ### 
   Clones the schema. Necessary for the dictionary
  ###

  clone: () -> new Schema @definition, @options

  ### 
   Stores information about all registered schemas
  ###

  dictionary: (value) ->
    return @_dictionary if not arguments.length
    @_dictionary = value
    @

  ###
   synonym for test
  ###

  validate: (target, next) -> @test target, next

  ###
  ###

  build: () ->
    flattenedDefinitions = utils.flattenDefinitions @definition

    @definitions = []
    for key of flattenedDefinitions
      @definitions.push @_definitionsByKey[key] = new PropertyDefinition @, key, flattenedDefinitions[key]


