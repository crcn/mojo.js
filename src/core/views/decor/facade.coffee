###

Notes:

1. cstep is used so that teardown & other functions wait until the previous method is calld. For instance - 
if setup is called, then teardown immediately, then teardown MUST wait until setup is complete

###


define ["underscore",
"cstep",
"../../utils/async",
"../../factories/either",
"../../factories/class",
"outcome",
"./base", 
"./template",
"./children",
"./listChildren",
"./events",
"./bindings",
"./transition"], (_, cstep, async, EitherFactory, ClassFactory, outcome, BaseViewDecorator, 
  TemplateDecorator, ChildrenDecorator, ListChildrenDecorator, 
  EventsDecorator, BindingsDecorator, TransitionDecorator) ->
    
    # decorators are loaded in this order. Note that the order is important.
    availableDecorators = {

      # template must be loaded first because the following decorators handle an element
      "template": new ClassFactory(TemplateDecorator),

      # parent bindings must be set before child bindings
      "bindings": new ClassFactory(BindingsDecorator),

      # children must be loaded before the transition starts, otherwise there might be a delay
      "children": new EitherFactory(new ClassFactory(ChildrenDecorator), new ClassFactory(ListChildrenDecorator)),

      # events can go anywhere really
      "events": new ClassFactory(EventsDecorator),

      # transition should be the last-ish item since it adds a delay to everything else
      "transition": new ClassFactory(TransitionDecorator)
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

      load: (callback) -> @_callDecorFn "load", callback

      ###
      ###

      attach: (callback) -> @_callDecorFn "attach", callback


      ###
      ###

      remove: (callback) -> @_callDecorFn "remove", callback

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
          factory = availableDecorators[name]
          if not factory.test(@view) and @_decorators[name]
            @_changed = true
            @_decorators[name].dispose()
            delete @_decorators[name]
            


      ###
      ###

      _addDecorators: () ->

        priority = 0
        for name of availableDecorators
          priority++
          factory = availableDecorators[name]
          if factory.test(@view) and not @_decorators[name]
            @_decorators[name] = factory.createItem @view
            @_decorators[name].priority = priority
            @_changed = true


















