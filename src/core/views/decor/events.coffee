define ["disposable", "./base"], (disposable, BaseDecorator) ->
  
  class EventsDecorator extends BaseDecorator


    ###
    ###

    setup: (callback) ->

      e = @_events()
      @_disposeBindings()
      @_disposable = disposable.create()




      for selector of e 
        @_addBinding selector, e[selector]

        

      callback()

    ###
    ###

    teardown: (callback) ->
      @_disposeBindings()
      callback()


    ###
    ###

    _addBinding: (selector, viewMethod) ->

      selectorParts = selector.split " "
      action = selectorParts.pop()
      selectors = selectorParts.join(",")

      elements = @view.element.find(selectors)
      # throw new Error("element method #{action} does not exist") 
      elements.bind(action, cb = () =>
        @view[viewMethod].apply(@view, arguments)
      )

      @_disposable.add(() ->
        elements.unbind action, cb
      )




    ###
    ###

    _disposeBindings: () ->
      return if not @_disposable
      @_disposable.dispose()
      @_disposable = undefined


    ###
    ###

    _events: () ->
      @view.get "events"


  EventsDecorator.test = (view) ->
    view.has "events"

  EventsDecorator