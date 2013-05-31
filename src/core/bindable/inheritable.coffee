define ["bindable"], (bindable) ->
  

  class InheritableObject extends bindable.Object


    ###
     If the key doesn't exist, then inherit it from the parent
    ###

    get: (key) -> 

      # try to find the value in this view
      ret = super(key)

      # value doesn't exist? check the parent
      if not ret
        ret = @_parent?.get(key)

        # value exists? set to this object so we don't have to check the parent anymore
        if ret

          # create a binding incase the parent key changes - needs to be reflected
          # in the object
          unless @_parentBindings
            @_parentBindings = []

          @_parentBindings.push binding = @_parent.bind(key).to(@, key).now()

          # if the value changes in this object, then break it off from the parent
          @bind key, (value) => 
            binding.dispose()
            @_parentBindings.splice @_parentBindings.indexOf(binding), 1

          
      ret

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