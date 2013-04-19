define ["../collection", "underscore", "isa"], (ViewCollection, _, isa) ->
  
  class SelectableDecorator extends ViewCollection

    constructor: (@view) ->
      super()
      @reset @_setupControllers()
      for controller in @source()
        @view.emit @name, controller

    ###
    ###

    _setupControllers: () ->
      ops = @_options()
      return [@_newController(_.extend(ops, { _name: @name }))] if @_isSingle ops
      _controllers = []
      for key of ops
        keyParts = key.split(" ")
        selector = keyParts.pop()
        property = keyParts.pop()
        options  = ops[key]
        options._name = property or selector
        options.selector = selector

        _controllers.push @[property or selector] = controller = @_newController options

      _controllers

    ###
    ###

    _options: () -> @view[@name]

    ###
    ###

    _newController: (options) ->
      clazz = @controllerClass
      controller = new clazz @, options
      @view.set(options._name, controller) 
      @view[options.name] = controller
      controller

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