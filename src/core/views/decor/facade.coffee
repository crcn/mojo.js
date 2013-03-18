###

Notes:

1. cstep is used so that teardown & other functions wait until the previous method is calld. For instance - 
if setup is called, then teardown immediately, then teardown MUST wait until setup is complete

###


define ["underscore",
"cstep",
"async",
"outcome",
"./base", 
"./template",
"./events",
"./bindings",
"./transition",
"./html"], (_, cstep, async, outcome, BaseViewDecorator, TemplateDecorator, EventsDecorator, BindingsDecorator, TransitionDecorator, HtmlDecorator) ->


    availableDecorators = {
      "template": TemplateDecorator,
      "html": HtmlDecorator,
      "transition": TransitionDecorator,
      "events": EventsDecorator,
      "bindings": BindingsDecorator
    }

    
    
    class ViewDecorator extends BaseViewDecorator
  
      ###
      ###

      constructor: (@view) ->

        @dispose()

        # wait for the view to initialize
        view.bind "initialized", @init

      ###
      ###

      init: () =>

        # if the options change in the view, then update the decorators as well
        @view.on "change", @_setupDecorators

        # setup the decorators immediately
        @_setupDecorators()

      ###
      ###

      setup: (callback) -> @_callDecorFn "setup", callback

      ###
      ###

      resetup: (callback) -> @_callDecorFn "resetup", callback

      ###
      ###

      teardown: (callback) -> @_callDecorFn "teardown", callback

      ###
      ###

      dispose: () ->

        if @_decorArray
          for decor in @_decorArray
            decor.dispose()

        @_decorArray = []
        @_decorators = {}



      ###
      ###

      _callDecorFn: cstep (name, callback) ->
        async.eachSeries @_decorArray, ((decor, next) ->
          decor[name].call decor, next
        ), callback


      ###
      ###

      _setupDecorators: () =>
        @_removeDecorators()
        @_addDecorators()

        if @_changed
          @_changed = false
          @_decorArray = _.values(@_decorators).sort (a, b) -> if a.priority > b.priority then 1 else -1



      ###
      ###

      _removeDecorators: () ->
        for name of availableDecorators
          clazz = availableDecorators[name]
          if not clazz.test(@view) and @_decorators[name]
            @_changed = true
            @_decorators[name].dispose()
            delete @_decorators[name]
            


      ###
      ###

      _addDecorators: () ->

        priority = 0
        for name of availableDecorators
          priority++
          clazz = availableDecorators[name]
          if clazz.test(@view) and not @_decorators[name]
            @_decorators[name] = new clazz @view
            @_decorators[name].priority = priority
            @_changed = true


















