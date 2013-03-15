define ["require", "./base", "../collections/concrete", "underscore", "async"], (require, BaseView, Collection, _, async) ->



  class ContainerView extends BaseView

    ###
    ###

    init: (options) ->

      super options

      options.defaults {
        childrenElement: ".children",
        childElement: "div"
      }

      @children = new Collection()
      @children.source(options.get("children") or [])

    ###
    ###

    attach: (selector, callback = (() ->)) ->
      super selector, () => 

        # start listening to the children AFTER an element is present
        if not @_listening  
          @_listening = true
          @children.on "updated", @_onChildrenUpdated

        @_attachChildren callback

    ###
    ###

    _onChildrenUpdated: (event) =>
      @["_" + event.type](event)

    ###
    ###

    _reset: (event) ->
      @_attachChildren()

    ###
    ###

    _replace: (event) ->
      throw new Error "cannot replace right now"

    ###
    ###

    _remove: (event) ->
      $el = $(@_childElement().children()[event.index])
      $el.detach()

    ###
    ###

    _add: (event) ->
      @_attachChild event.item

    ###
    ###

    _attachChildren: (callback) ->

      # remove all the children
      @_childElement().children().unbind "*"
      @_childElement().html ""

      async.forEach @children.source(), @_attachChild, callback

    ###
    ###

    _attachChild: (child, callback = (() ->)) =>
      child.attach @_childElement().append("<#{@get("childElement")} />").children().last()

    ###
    ###

    _childElement: () -> if @get("childrenElement") then @$ @get("childrenElement") else @element


