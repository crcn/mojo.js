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
"./states/decorator",
"./passDown",
"./transition"], (_, cstep, async, ClassFactory, generateId, BaseViewDecorator, 
  ViewCollection, compose,
  TemplateDecorator, ChildrenDecorator, ListDecorator, 
  AttributesDecorator, EventsDecorator, BindingsDecorator, DraggableDecorator, DroppableDecorator, StatesDecorator, PassDownDecorator, TransitionDecorator) ->
    

    decor = (name, clazz) ->
      { name: name, factory: new ClassFactory(clazz) }

    availableDecorators = [

      # template must be loaded first because the following decorators handle an element
      decor("template", TemplateDecorator),

      # element attributes
      decor("attributes", AttributesDecorator),

      # passes properties down the children
      decor("passDown", PassDownDecorator),

      # parent bindings must be set before child bindings
      decor("bindings", BindingsDecorator),

      # creates a list of items
      decor("list", ListDecorator),

      # states view
      decor("states", StatesDecorator),

      # children must be loaded before the transition starts, otherwise there might be a delay
      decor("children", ChildrenDecorator),

      # events can go anywhere really
      decor("events", EventsDecorator),

      # transition should be the last-ish item since it adds a delay to everything else
      decor("transition", TransitionDecorator),

      # makes the view draggable
      decor("draggable", DraggableDecorator),

      # makes the view droppable
      decor("droppable", DroppableDecorator)
    ]



    class ViewDecorator extends BaseViewDecorator
  
      ###
      ###

      constructor: (@view) ->
        @_id = generateId()
        @_facadeCollection = new ViewCollection()
        @_facadeCollection.limit = 1
        compose @, @_facadeCollection, ["render", "load", "display", "remove"]
        @dispose()


      ###

      inherit: (key, to, value) ->
        for key of availableDecorators
          decoratorClass = availableDecorators[key]
          if decoratorClass.test 
      
      ###

      ###
      ###

      init: () =>
        return if @_initialized
        @_initialized = true

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

        for d, priority in availableDecorators

          factory = d.factory
          name = d.name

          if factory.test(@view)
            decor = factory.createItem @view
            decor.priority = priority
            decor._id = name
            decorators.push decor

        
        decorators = decorators.sort (a, b) -> if a.priority > b.priority then 1 else -1
        @_facadeCollection.reset decorators



















