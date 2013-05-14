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
"./transition"], (_, cstep, async, ClassFactory, generateId, BaseViewDecorator, 
  ViewCollection, compose,
  TemplateDecorator, ChildrenDecorator, ListDecorator, 
  AttributesDecorator, EventsDecorator, BindingsDecorator, DraggableDecorator, 
  DroppableDecorator, StatesDecorator, TransitionDecorator) ->
    

    decor = (name, clazz) ->
      { name: name, factory: new ClassFactory(clazz) }


    ###
    loading order:

    1. children templates
    2. parent templates
    3. parent -> child bindings
    ###

    availableDecorators = [

      # parent bindings must be set before child bindings
      decor("bindings", BindingsDecorator),

      # transition should be the last-ish item since it adds a delay to everything else
      decor("transition", TransitionDecorator),

      # creates a list of items
      decor("list", ListDecorator),

      # states view
      decor("states", StatesDecorator),

      # children must be loaded before the transition starts, otherwise there might be a delay
      decor("children", ChildrenDecorator),

      # template must be loaded first because the following decorators handle an element
      decor("template", TemplateDecorator),

      # element attributes
      decor("attributes", AttributesDecorator),

      # events can go anywhere really
      decor("events", EventsDecorator),

      # makes the view draggable
      decor("draggable", DraggableDecorator),

      # makes the view droppable
      decor("droppable", DroppableDecorator)
    ]


    setup: (view) ->
      decorators = []

      for d, priority in availableDecorators

        factory = d.factory
        name = d.name

        if factory.test view
          decor = factory.createItem view
          decor.priority = priority
          decor._id = name
          decorators.push decor

      decorators = decorators.sort (a, b) -> if a.priority > b.priority then 1 else -1
      view.decorators.push.apply view.decorators, decorators 





















