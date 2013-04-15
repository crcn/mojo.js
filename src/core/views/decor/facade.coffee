###

Notes:

1. cstep is used so that teardown & other functions wait until the previous method is calld. For instance - 
if setup is called, then teardown immediately, then teardown MUST wait until setup is complete

###


define ["underscore",
"cstep",
"../../utils/async",
"../../factories/class",
"../../utils/idGenerator",
"outcome",
"./base",  
"../collection",
"../../utils/compose",
"./template",
"./children",
"./list/decorator",
"./attributes",
"./events",
"./bindings",
"./dragdrop/draggable",
"./dragdrop/droppable",
"./transition"], (_, cstep, async, ClassFactory, generateId, outcome, BaseViewDecorator, 
  ViewCollection, compose,
  TemplateDecorator, ChildrenDecorator, ListDecorator, 
  AttributesDecorator, EventsDecorator, BindingsDecorator, DraggableDecorator, DroppableDecorator, TransitionDecorator) ->
    
    # decorators are loaded in this order. Note that the order is important.
    availableDecorators = {

      # template must be loaded first because the following decorators handle an element
      "template": new ClassFactory(TemplateDecorator),

      # element attributes
      "attributes": new ClassFactory(AttributesDecorator),

      # parent bindings must be set before child bindings
      "bindings": new ClassFactory(BindingsDecorator),

      # creates a list of items
      "list": new ClassFactory(ListDecorator),
      
      # children must be loaded before the transition starts, otherwise there might be a delay
      "children": new ClassFactory(ChildrenDecorator),

      # events can go anywhere really
      "events": new ClassFactory(EventsDecorator),

      # transition should be the last-ish item since it adds a delay to everything else
      "transition": new ClassFactory(TransitionDecorator),

      # makes the view draggable
      "draggable": new ClassFactory(DraggableDecorator),

      # makes the view droppable
      "droppable": new ClassFactory(DroppableDecorator)
    }


    
    class ViewDecorator extends BaseViewDecorator
  
      ###
      ###

      constructor: (@view) ->
        @_id = generateId()
        @_facadeCollection = new ViewCollection()
        @_facadeCollection.limit = 1
        compose @, @_facadeCollection, ["load", "render", "display", "remove"]
        @dispose()

      ###
      ###

      init: () =>

        # setup the decorators immediately
        @_addDecorators()

      ###
      ###

      dispose: () ->

        for item in @_facadeCollection.source()
          item.dispose()

        @_facadeCollection.reset []
        @_decorators = {}

      ###
      ###

      _addDecorators: () ->

        decorators = []

        priority = 0
        for name of availableDecorators
          priority++
          factory = availableDecorators[name]

          if factory.test(@view)
            decor = factory.createItem @view
            decor.priority = priority
            decor._id = name
            decorators.push decor

        
        decorators = decorators.sort (a, b) -> if a.priority > b.priority then 1 else -1
        @_facadeCollection.reset decorators



















