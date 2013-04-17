###
 defines singleton properties which can be propogated to all
 children
###

define ["./base", "toarray"], (BaseDecorator, toarray) ->
  
  class SingletonDecorator extends BaseDecorator

    ###
    ###

    render: (callback) ->

      # setup a reference to the view via the dom element
      @view.el[0]._view = @view

      @_bindings = []

      # next, find all the views with properties to pass down
      p = @view.el.parent()[0]


      @_bindings = []

      # i = sanity
      while p.parentNode

        if p._view and p._view.passDown 
          pd = toarray p._view.passDown
          for property in pd
            @_bindings.push p._view.bind(property).to(@view, property)

        p = p.parentNode


      callback()


    remove: (callback) ->
      for binding in @_bindings
        binding.dispose()
      @_bindings = []
      callback()





  SingletonDecorator.test = (value) -> true

  SingletonDecorator