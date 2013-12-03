bindable = require "bindable"
decor    = require "bindable-decor"
_ = require "underscore"
type = require "type-component"


_getBindingKey = (key) -> key.split(".").shift()

_combineSuperProps = (target, property) ->
  constructor = target.constructor
  unless constructor.__combined
    constructor.__combined = {}

  return if constructor.__combined[property]
  constructor.__combined[property] = true

  p = constructor.prototype
  defined = []
  while p
    defined = (p.define or []).concat(defined)

    p = p.constructor.__super__

  constructor.prototype[property] = target[property] = defined




class InheritableObject extends bindable.Object
  
  ###
  ###

  define: ["parent"]
  
  ###
  ###

  constructor: () ->
    super @
    @_defined = {}

    _combineSuperProps(@, "define")
    @_define @define...

  ###
  ###

  get: (key) ->
    ret = super(key) 

    # return if the value exists
    return ret if ret?

    # the binding key is the first part of the property - could be something
    # such as teacher.class.name. We ONLY want "teacher" property
    bindingKey

    # fast way of grabbing the bindable key
    if ~(i = key.indexOf("."))
      bindingKey = key.slice(0, i)
    else
      bindingKey = key

    # if the property exists, then skip inheritance
    return if @[bindingKey]?

    # inherit from the parents
    @_inherit bindingKey

    # return the value inherited
    super key


  ###
  ###

  _set: (key, value) ->

    if type(key) is "string" and ~key.indexOf(".")
      @get key

    super arguments...

  ###
  ###

  _define: () ->
    for key in arguments
      @_defined[key] = true

  ###
  ###

  _inherit: (key) ->
    return if @_defined[key]
    @_defined[key] = true

    parentPropertyBinding = undefined
    parentBinding         = undefined

    # bind to the parent - it could change
    parentBinding = @bind("parent").to((parent) =>
      parentPropertyBinding?.dispose()

      # bind the parent property to this property. Note that
      # properties will be recursively bound
      parentPropertyBinding = parent.bind(key).to(@, key).now()
    ).now()

    # if the property is defined on the view controller explicitly, then
    # destroy inheritance
    valueBinding = @bind(key).to((value) =>

      # same value as parent? ignore.
      return if @parent?[key] is value
      valueBinding.dispose()
      parentPropertyBinding?.dispose()
      parentBinding?.dispose()
    )

    valueBinding.now()

    # if the value doesn't exist, then log a warning - property is not defined
    # in the view controller!
    unless @[key]?
      console.warn "inherted property %s doesn't exist in %s", key, @path()

    undefined

 

module.exports = InheritableObject