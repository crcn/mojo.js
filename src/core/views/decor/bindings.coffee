define ["./base", "rivets", "dref"], (BaseViewDecorator, rivets, dref) ->



  rivets.configure({
    adapter: {
      subscribe: (obj, keypath, callback) ->
        obj.bind keypath.replace(/,/g, "."), callback

      unsubscribe: (obj, keypath, callback) ->
        #if obj.on
        #  obj.off "change:" + keypath.replace(/,/g, "."), callback

      read: (obj, keypath) ->
        obj.get? keypath.replace(/,/g, ".")

      publish: (obj, keypath, value) ->
        obj.set? keypath.replace(/,/g, "."), value
    }
  });

  rivets.formatters.negate = (value) -> not value

  
  class BindingsDecorator extends BaseViewDecorator

    ###
    ###

    init: () ->
      super()
      @bindings = if typeof @options is "object" then @options else undefined

    ###
    ###

    load: () ->
      @_setupExplicitBindings() if @bindings

    ###
     bindings to the elements
    ###

    render: () ->
      return if @view.__bound
      @view.__bound = true
      if @view.section.elements.length

        model = @view.get("model") ? @view.get("item") ? @view

        rivets.bind @view.section.elements.filter((el) ->
          el.nodeName isnt "#comment" and el.nodeName isnt "#text"
        ), { data: model, item: model, model: model, view: @view }


    ###
     explicit bindings are properties from & to properties of the view controller
    ###

    _setupExplicitBindings: () ->
      bindings = @bindings
      @_setupBinding key, bindings[key] for key of bindings

    ###
    ###

    _setupBinding: (property, to) ->
      keyParts = property.split " "

      options = {}

      if typeof to is "function" 
        oldTo = to
        to = () =>
          oldTo.apply @view, arguments

      if to.to
        options = to
      else
        options = { to: to }

      for keyPart in keyParts
        options.property = keyPart
        @view.bind(options).now()




  BindingsDecorator.getOptions = (view) -> view.bindings or !!view.template

  BindingsDecorator