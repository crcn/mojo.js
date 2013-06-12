

define ["./base",  
"../collection",
"./template",
"./attributes",
"./events",
"./bindings",
"./sections/index",
"./dragdrop/draggable",
"./dragdrop/droppable",
"./transition", "./preload"], (BaseViewDecorator, 
  ViewCollection, 
  TemplateDecorator, 
  AttributesDecorator, EventsDecorator, BindingsDecorator, SectionsDecorator, DraggableDecorator, 
  DroppableDecorator, TransitionDecorator, PreloadDecorator) ->
    

    _decor = (name, clazz, inheritable = true) ->
       name        : name
       clazz       : clazz
       inheritable : inheritable


    ###
    loading order:

    1. children templates
    2. parent templates
    3. parent -> child bindings
    ###

    # note that the decorator order is very important
    availableDecorators = [

      # bindings = priority for explicit data-bindings
      _decor("bindings"   , BindingsDecorator),

      # section / child decorators. These have (almost) highest
      # priority since they should be added before the template is loaded
      _decor("sections"   , SectionsDecorator),

      # loads a template, and injects the sections / children (from above) on load
      _decor("template"   , TemplateDecorator, false),

      # additional decorators that don't have high priority - get added on .render() & .display()
      _decor("preload"    , PreloadDecorator),
      _decor("attributes" , AttributesDecorator),
      _decor("transition" , TransitionDecorator),
      _decor("events"     , EventsDecorator),
      _decor("draggable"  , DraggableDecorator),
      _decor("droppable"  , DroppableDecorator)
    ]

    ###
    ###

    addDecoratorClass: (options = {}) -> 
      availableDecorators.push( 
        _decor options.name, 
        options.class or options.clazz, 
        options.inheritable
      )

    ###
    ###

    setup: (view, decor) -> 

      if decor
        _decorators = @_findDecorators decor
      else
        _decorators = view.__decorators


      # decorators are cached in the view class
      if _decorators
        @setDecorators view, _decorators
      else
        decor = @findDecorators view
        view.constructor.prototype.__decorators = view.__decorators = decor
        @setup view

    ###
     Finds ALL the decorators for a view, including the parent 
     decorators which should be inherited (but overridden by the child prototype)
    ###

    findDecorators: (view) -> 
      decorators = []

      cv = view
      pv = undefined

      # inherit from the parent classes
      while cv and cv.__isView

        # attach from the class, along with the prototype. class = optimal
        decorators = decorators.concat @_findDecorators(cv, pv).concat @_findDecorators cv.constructor, pv?.constructor
        pv = cv
        cv = cv.__super__

      decorators.sort (a, b) -> if a.priority > b.priority then 1 else -1

    ###
    ###

    _findDecorators: (proto, child) ->
      decorators = []


      for d, priority in availableDecorators
        clazz       = d.clazz

        # skip if the decorator is not inheritable
        if child and not d.inheritable
          continue

        if options = clazz.getOptions proto

          #skip if the options are exactly the same
          continue if child and options is clazz.getOptions child
          decorators.push { clazz: clazz, name: d.name, options: options, priority: priority }

      decorators

    ###
    ###

    setDecorators: (view, decorators) ->
      for decor in decorators
        d = new decor.clazz view, decor.options
        d._id = decor.name
        view.decorators.push d






















