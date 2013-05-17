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
       name    : name
       factory : new ClassFactory(clazz) 


    ###
    loading order:

    1. children templates
    2. parent templates
    3. parent -> child bindings
    ###

    # note that the decorator order is very important
    availableDecorators = [

      # bindings = priority for explicit data-bindings
      decor("bindings"   , BindingsDecorator),

      # section / child decorators. These have (almost) highest
      # priority since they should be added before the template is loaded
      decor("list"       , ListDecorator),
      decor("states"     , StatesDecorator),
      decor("children"   , ChildrenDecorator),

      # loads a template, and injects the sections / children (from above) on load
      decor("template"   , TemplateDecorator),

      # additional decorators that don't have high priority - get added on .render() & .display()
      decor("attributes" , AttributesDecorator),
      decor("transition" , TransitionDecorator),
      decor("events"     , EventsDecorator),
      decor("draggable"  , DraggableDecorator),
      decor("droppable"  , DroppableDecorator)
    ]


    setup: (view) ->
      decorators = []

      for d in availableDecorators

        factory = d.factory
        name = d.name

        if factory.test view
          decor = factory.createItem view
          decor._id = name
          decorators.push decor

      view.decorators.push.apply view.decorators, decorators 





















