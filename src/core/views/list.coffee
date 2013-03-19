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

      # these are the children of this container
      @children = new Collection()
      @children.source @get("children") or []

      @source = new Collection()

      # bind the model model locator which contains all bindable data. This is important so that
      # data is easily bindable without making it a singleton item
      @bind "modelLocator", @_setModelLocator


    ###
    ###

    _childElement: () -> if @get("childrenElement") then @$ @get("childrenElement") else @element

    ###
    ###

    _setModelLocator: () =>
      for child in @children.source() 
        @_setChildModelLocator child

    ###
    ###

    _setChildModelLocator: (child) ->
      child.set "modelLocator", @get "modelLocator"


