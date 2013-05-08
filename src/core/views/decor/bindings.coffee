define ["./base", "rivets", "dref"], (BaseViewDecorator, rivets, dref) ->



  rivets.configure({
    adapter: {
      subscribe: (obj, keypath, callback) ->
        obj.bind keypath.replace(/,/g, "."), callback

      unsubscribe: (obj, keypath, callback) ->
        #if obj.on
        #  obj.off "change:" + keypath.replace(/,/g, "."), callback

      read: (obj, keypath) ->
        obj.get keypath.replace(/,/g, ".")

      publish: (obj, keypath, value) ->
        obj.set keypath.replace(/,/g, "."), value
    }
  });

  rivets.formatters.negate = (value) -> not value

  
  class BindingsDecorator extends BaseViewDecorator

    ###
    ###

    load: (callback) ->
      @_setupExplicitBindings() if @view.bindings
      callback()

    ###
    ###

    render: (callback) ->
      if @view.section.elements.length
        rivets.bind @view.section.elements.filter((el) ->
          el.nodeName isnt "#comment" and el.nodeName isnt "#text"
        ), { data: @view.get("item") or @view, view: @view }

      setTimeout(callback, 0)


    ###
    ###

    _setupExplicitBindings: () ->
      bindings = @view.bindings

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
        @view.bind options




  BindingsDecorator.test = (view) -> true

  BindingsDecorator