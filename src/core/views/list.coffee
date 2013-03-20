define ["require", "./base", "../collections/concrete", "underscore", "async"], (require, BaseView, Collection, _, async) ->



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

      # these are the children of this container
      @children = @_createChildren()
      @children.glueFrom (childrenSource or []), @

      @source = @_createSource()
      @source.glueFrom (sourceSource or []), @


    ###
    ###

    _childElement: () -> if @get("childrenElement") then @$ @get("childrenElement") else @element

    ###
    ###

    _createSource: () -> new Collection()

    ###
    ###

    _createChildren: () -> new Collection()


