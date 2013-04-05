define ["disposable", "./base"], (disposable, BaseDecorator) ->
  
  class EventsDecorator extends BaseDecorator


    ###
    ###

    display: (callback) ->
      e = @_events()
      @_disposeBindings()
      @_disposable = disposable.create()

      for selector of e 
        @_addBinding selector, e[selector]

      @view.emit "events"

      callback()

    ###
    ###

    remove: (callback) ->
      @_disposeBindings()
      callback()


    ###
    ###

    _addBinding: (selector, viewMethod) ->

      selectorParts = selector.split " "
      actions = selectorParts.shift().split(/\|/g).join(" ")
      selectors = selectorParts.join(",")

      cb = () =>

        if typeof viewMethod is "function"
          ref = viewMethod
        else 
          console.log viewMethod
          ref = @view.get viewMethod

        ref.apply(@view, arguments)


      if !selectors.length
        elements = @view.el
      else
        elements = @view.$(selectors)

      elements.bind(actions.toLowerCase(), cb)

      @_disposable.add(() ->
        elements.unbind actions, cb
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