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

      while p
        if p.passDown
          pd = toarray p.passDown
          for property in pd
            @_bindings.push p.bind(property).to(@view, property)

        p = p.parent()


      callback()


    remove: (callback) ->
      for binding in @_bindings
        binding.dispose()
      @_bindings = []
      callback()





  SingletonDecorator.test = (value) -> true

  SingletonDecorator