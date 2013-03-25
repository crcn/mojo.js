define ["require", "./base", "bindable", "underscore", "async"], (require, BaseView, bindable, _, async) ->



  class ContainerView extends BaseView

    ###
    ###

    childrenElement: ".children",

    ###
    ###

    childElement: "div"

    ###
    ###

    init: () ->
      super()

      childrenSource = @get("children")
      sourceSource   = @get("source")

      @set("children", undefined)
      @set("source", undefined)
      
      # these are the children of this container
      @children = @_createChildren()
      @children.reset childrenSource

      @source = @_createSource()
      @source.reset sourceSource

    ###
    ###

    _childElement: () -> if @get("childrenElement") then @$ @get("childrenElement") else @element

    ###
    ###

    _createSource: () -> new bindable.Collection()

    ###
    ###

    _createChildren: () -> new bindable.Collection()


