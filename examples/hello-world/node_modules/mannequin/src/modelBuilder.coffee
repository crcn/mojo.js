_ = require "underscore"
toarray = require "toarray"
async = require "async"
step = require "stepc"
Model = require "./model"
bindable = require "bindable"
outcome = require "outcome"
EventEmitter = require("events").EventEmitter

_modelClassId = 0

class Virtual

  ###
  ###

  __isVirtual: true

  ###
  ###

  constructor: (@key) ->  

    @get () -> 
      @[key]

    @set (value) ->
      @[key] = value

    @_bindings = []

  
  ###
  ###

  call: (context, value) =>

    if arguments.length is 1 
      return @_get.call context
    else
      return @_set.call context, value

    @

  ###
  ###

  setupBindings: (context) ->
    self = @
    for binding in @_bindings then do =>
      context.bind binding, (value) ->
        context.emit "change:#{self.key}", value


  ###
  ###

  get: (@_get) -> @


  ###
  ###

  set: (@_set) -> @


  ###
  ###

  bind: (@_bindings...) -> 


module.exports = class ModelBuilder extends EventEmitter

  ###
  ###

  constructor: (@dictionary, @name, @schema) ->
    @_virtuals = {}
    @_pre = {}
    @_post = {}

    @properties = @methods = @getClass().prototype
    @statics = @getClass()
    @_setupMethods()

  ###
  ###

  pre: (keys, callback) -> @_registerPrePost @_pre, keys, callback

  ###
  ###

  post: (keys, callback) -> @_registerPrePost @_post, keys,  callback

  ###
   registers static vars
  ###

  static: (key, callback) ->

    if arguments.length is 1
      for k of key
        @static k, key[k]
        return

    @getClass()[key] = callback

  ###
   virtual methods for getters
  ###

  virtual: (key) ->
    @_virtuals[key] or (@_virtuals[key] = new Virtual(key))

  ###
  ###

  initModel: (model) ->
    @_initPropertyTransformation model, def for def in @schema.refs()



  ###
  ###

  _initPropertyTransformation: (model, def) ->
    transformer = model.transform def.key

    @emit "transformModelProperty", model, def

    if def.options.$multi
      @_initCollectionTransformation model, transformer, def
    else
      @_initModelTransformation model, transformer, def

    transformer.reset()

  ###
  ###

  _initCollectionTransformation: (model, transformer, def) ->

    refClass = @dictionary.modelBuilder(def.options.$ref).getClass()

    transformer.map((source) =>
      col = @createCollection model, def
      
      col.parent = model

      @_initCollectionItemTransformation col, def, refClass

      col.reset source
      col
    )

    if not model.get(def.key)
      model._set def.key, []

  ###
  ###

  _initCollectionItemTransformation: (col, def, refClass) ->
    col.transform().map(@_castRefClass(refClass)).map (item) ->
      item.parent = col
      item.definition = def
      item


  ###
  ###

  _initModelTransformation: (model, transformer, def) ->
    refClass = @dictionary.modelBuilder(def.options.$ref).getClass()
    transformer.map(@_castRefClass(refClass)).map((model) ->
      model.definition = def
      model
    )
    for virtual of @_virtuals
      @_virtuals[virtual].setupBindings model

  
  ###
  ###

  _castRefClass: (refClass) =>
    (item) ->
      return if not item
      return item if item.classId is refClass.prototype.classId

      # fetch the data if it's a ref item
      if item.classId
        item = item.data

      return new refClass item 


  ###
  ###

  createCollection: (item) ->
    new bindable.Collection()

  ###
  ###

  getClass: () ->

    return @_class if @_class

    clazz = @_class = () ->
      clazz.__super__.constructor.apply(this, arguments);


    @_class.prototype             = _.extend({}, Model.prototype)
    @_class.prototype.schema      = @schema
    @_class.prototype.constructor = clazz
    @_class.__super__             = Model.prototype
    @_class.prototype.builder     = @
    @_class.prototype.dictionary  = @dictionary
    @_class.prototype._pre        = @_pre
    @_class.prototype._post       = @_post
    @_class.prototype.classId     = ++_modelClassId
    @_class.prototype._virtual    = @_virtuals
    @_class.builder = @
    @_class

  ###
  ###

  setClass: (@_class) ->
    @

  ###
  ###

  _registerPrePost: (pp, keys, callback) ->
    for key in toarray(keys)
      @_prePost(pp, key).push callback
    @

  ###
  ###

  _setupMethods: () ->
    @methods.model = (name) =>
      @dictionary.modelBuilder(name).getClass()

  ###
  ###

  _prePost: (pp, key) ->
    return pp[key] if pp[key]

    @_pre[key]  = []
    @_post[key] = []

    original = @_class.prototype[key]

    pre = @_pre[key]
    post = @_post[key]

    @_class.prototype[key] = (next) ->
      o = outcome.e next

      self = @

      # pre
      step.async (() ->
        async.eachSeries pre, ((fn, next) ->
          fn.call self, next
        ), @
      ),

      # original
      (o.s () ->
        return @() if not original
        original.call self, @
      ), 

      # post
      (o.s () ->
        async.eachSeries post, ((fn, next) ->
          fn.call self, next
        ), @
      ), 

      # done
      next


    @_prePost pp, key


