define ["./base", "../collection", "underscore", "isa"], (BaseDecorator, ViewCollection, _, isa) ->
  
  class SelectableDecorator extends BaseDecorator

    ###
    ###

    init: () ->
      @_collection = new ViewCollection @_setupControllers()
      for controller in @_collection.source()
        @view.emit @name, controller


    ###
    ###

    load: (callback) -> @_collection.load callback

    ###
    ###

    render: (callback) -> @_collection.render callback

    ###
    ###

    display: (callback) -> @_collection.display callback

    ###
    ###

    remove: (callback) -> @_collection.remove callback

    ###
    ###

    _setupControllers: () ->
      ops = @_options()
      return [@_newController(_.extend(ops, { name: Math.random() }))] if @_isSingle ops
      _controllers = []
      for key of ops
        keyParts = key.split(" ")
        selector = keyParts.pop()
        property = keyParts.pop()
        options  = ops[key]
        options.name = property or selector
        options.selector = selector

        _controllers.push @[property or selector] = controller = @_newController options

        if property
          @view[property] = controller

      _controllers



    ###
    ###

    _options: () -> @view[@name]

    ###
    ###

    _newController: (options) ->
      clazz = @controllerClass
      return new clazz @, options

    ###
    ###

    _isSingle: (options) ->
      return true if isa.array options
      for key of options
        v = options[key]
        if typeof v is "string"
          return true

      return false


  SelectableDecorator