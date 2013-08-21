bindable = require "bindable"


_getBindingKey = (key) -> key.split(".").shift()


class InheritableObject extends bindable.Object

  ###
  ###

  get: (key) -> super(key) ? @_inherit(key)

  ###
   inherits a property from the parent
  ###

  _inherit: (key) -> 

    bindingKey = _getBindingKey(key)

    # binding key already exists in this object? ignore inheritance
    ret = InheritableObject.__super__.get.call(@, bindingKey)

    return undefined if ret?

    if @_parent and not @_parentBindings?[bindingKey]

      # create a binding incase the parent key changes - needs to be reflected
      # in the object
      unless @_parentBindings
        @_parentBindings = {}

      @_parentBindings[bindingKey]?.dispose()
      @_parentBindings[bindingKey] = binding = @_parent.bind(bindingKey).to(@, bindingKey)
      @_parentBindings[bindingKey].now()

      # if the value changes in this object, then break it off from the parent
      @bind bindingKey, (value) => 
        # same as the parent value? ignore.
        return if value is binding.value
        
        binding.dispose()
        delete @_parentBindings[bindingKey]
      
    return @_parent?.get key

  ###
  ###

  _set: (key, value) ->
    @_inherit key
    super key, value


  ###
   finds the owner of a given property
  ###

  owner: (property) ->  
    @_owner _getBindingKey(property), @
    
  ###
  ###

  _owner: (property, caller) ->

    return @_parent.owner(property, caller) if @_parent and @_parentBindings?[property]

    # call super _get to bypass inheritance
    return @ if InheritableObject.__super__.get.call(@, property)?

    return caller

  ###
   bubbles up an event to the root object
  ###

  bubble: () ->
    @emit arguments...
    @_parent?.bubble arguments...

  ###
  ###

  dispose: () ->
    super()
    binding.dispose() for binding in @_parentBindings?
    @_parentBindings = undefined

  ###
  ###

  linkChild: () ->
    for child in arguments
      child._parent = @
    @

module.exports = InheritableObject