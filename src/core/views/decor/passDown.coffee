###
 defines singleton properties which can be propogated to all
 children
###

define ["./base", "toarray"], (BaseDecorator, toarray) ->
  
  class SingletonDecorator extends BaseDecorator

    ###
    ###

    render: (callback) ->
      @_bindings = []

      # next, find all the views with properties to pass down
      p = @view.parent()
      inherit = toarray @view.inherit

      while p
        if p.passDown
          pd = toarray p.passDown
          for property in pd
            console.log property
            @_bindings.push p.bind(property).to(@view, property).to (value) ->
              console.log property

        for i in inherit
          p.bind(i).to(@view, i).to (value) ->
            console.log i

        p = p.parent()


      callback()


    remove: (callback) ->
      for binding in @_bindings
        binding.dispose()
      @_bindings = []
      callback()





  SingletonDecorator.test = (value) -> true

  SingletonDecorator