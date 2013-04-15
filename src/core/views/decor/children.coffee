
define ["./base", "outcome", "../../utils/async", "../collection"], (BaseViewDecorator, outcome, async, Collection) ->
  
  class ChildrenDecorator extends BaseViewDecorator

    ###
    ###

    init: () ->
      super()
      childrenClasses = @view.children
      @_children = new Collection()

      # modalBody .modal-body
      for viewName of childrenClasses

        selectorParts = viewName.split(" ")
        property = selectorParts.shift()
        selector = selectorParts.shift() or property

        clazz = childrenClasses[viewName]
        view = new clazz()

        # make the views accesible from the selectors
        @_children[property] = view
        @view.set property, view
        view.__selector = selector
        @_children.push view


    ###
    ###

    load: (callback) ->  
      @view.children = @view.children = @_children
      @_children.load callback

    ###
    ###

    render: (callback) -> 

      for child in @_children.source()
        child.element @view.$ child.__selector

      @_children.render () ->
        callback()


    ###
    ###

    display: (callback) -> @_children.display callback

    ###
    ###

    remove: (callback) -> @_children.remove callback



  ChildrenDecorator.test = (view) ->
    # make sure children is present, and that it's an object
    return view.children and not view.children.__isCollection


  ChildrenDecorator