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
"../../utils/idGenerator",
"outcome",
"./base", 
"./template",
"./children",
"./listChildren",
"./attributes",
"./events",
"./bindings",
"./transition"], (_, cstep, async, EitherFactory, ClassFactory, generateId, outcome, BaseViewDecorator, 
  TemplateDecorator, ChildrenDecorator, ListChildrenDecorator, 
  AttributesDecorator,
  EventsDecorator, BindingsDecorator, TransitionDecorator) ->
    
    # decorators are loaded in this order. Note that the order is important.
    availableDecorators = {

      # template must be loaded first because the following decorators handle an element
      "template": new ClassFactory(TemplateDecorator),

      # element attributes
      "attributes": new ClassFactory(AttributesDecorator),

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
        @_id = generateId()
        @dispose()

      ###
      ###

      init: () =>

        # setup the decorators immediately
        @_addDecorators()

      ###
      ###

      load: (callback) -> 
        @view.emit "loadingDecorator"
        @_callDecorFn "load", callback

      ###
      ###

      attach: (callback) -> 
        @view.emit "attachingDecorator"
        @_callDecorFn "attach", callback


      ###
      ###

      remove: (callback) ->
        @view.emit "removingDecorator"
        @_callDecorFn "remove", callback

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

      _addDecorators: () ->

        priority = 0
        for name of availableDecorators
          priority++
          factory = availableDecorators[name]
          if factory.test(@view) and not @_decorators[name]
            @_decorators[name] = factory.createItem @view
            @_decorators[name].priority = priority

        
        @_decorArray = _.values(@_decorators).sort (a, b) -> if a.priority > b.priority then 1 else -1


















