_ = require("underscore")
bindable = require("bindable")
Transformers = require("./transformers")
isa = require "isa"
dref = require "dref"

module.exports = class Model extends bindable.Object

  ###
  ###

  constructor: (data = {}, options = {}) ->
    super {}
    _.extend @, options

    # data might have a virtual property
    @set data

    @init()

  ###
  ###

  init: () ->
    @builder.initModel @
    

  ###
  ###

  transform: (key, transformer) -> 
    transformer = @_transformer().use key, transformer
  ###
  ###

  validate: (callback) ->
    return callback() if not @schema
    @schema.test @, callback

  ###
  ###

  get: (key) ->
    return super key if arguments.length is 0

    if @_virtual[key]
      return @_virtual[key].call(@)

    super key

  ###
  ###

  _set: (key, value) ->

    if @_virtual[key]
      return @_virtual[key].call(@, value)

    super key, @_transform key, value

  ###
  ###

  toJSON: () -> @_toJSON @

  ###
  ###

  _toJSON: (data) ->
    newData = {}
    for definition in @schema.definitions
      v = if data.__isBindable then data.get definition.key else dref.get data, definition.key
      continue if v is undefined
      dref.set newData, definition.key, v

    _id = if data.__isBindable then data.get "_id" else dref.get data, "_id"
    
    if _id
      newData._id = _id

    newData



  ###
  ###

  _transform: (key, value) ->
    return value if not @__transformer
    return @__transformer.set(key, value)

  ###
  ###

  _transformer: () ->
    @__transformer || (@__transformer = new Transformers(@))





