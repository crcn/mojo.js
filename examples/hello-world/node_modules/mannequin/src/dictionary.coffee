utils        = require "./utils"
Schema       = require "./schema"
ModelBuilder = require "./modelBuilder"
EventEmitter = require("events").EventEmitter

###
 ties together schemas & models. It also allows business logic.
###

module.export = class Dictionary extends EventEmitter

  ###
  ###

  constructor: () ->
    @_schemas       = {}
    @_modelBuilders = {}

  ###
  ###

  register: (name, schema) ->
    @_schemas[name] = schema = if utils.isSchema(schema) then schema.clone() else new Schema(schema)
    schema.dictionary @
    return schema.modelBuilder = @modelBuilder name

  ###
  ###

  getSchema: (name) -> @_schemas[name]

  ###
  ###

  modelBuilder: (name) ->

    if @_modelBuilders[name]
      return @_modelBuilders[name]

    # emit so pre / post hooks can be created
    @emit "modelBuilder", @_modelBuilders[name] = modelBuilder = new ModelBuilder(@, name, @getSchema(name))
    modelBuilder


module.exports = () -> new Dictionary()