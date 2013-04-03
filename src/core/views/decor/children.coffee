
define ["./base", "outcome", "../../utils/async", "../collection"], (BaseViewDecorator, outcome, async, Collection) ->
  
  class ChildrenDecorator extends BaseViewDecorator

    ###
    ###

    load: (callback) ->  


      childrenClasses = @view.get "children"
      children = {}
      @_children = new Collection()

      for selector of childrenClasses
        clazz = childrenClasses[selector]
        view = new clazz()

        # make the views accesible from the selectors
        children[selector] = view
        view.__selector = selector
        @_children.push view

      @view.set "children", @view.children = children
      @_children.load callback

    ###
    ###

    render: (callback) -> 

      for child in @_children.source()
        child.element @view.$ child.__selector

      #console.log "RENDER CHILDREN"
      #console.log @_children
      @_children.render () ->
        #console.log "RENDERED CHILDREN"
        callback()


    ###
    ###

    display: (callback) -> @_children.display callback

    ###
    ###

    remove: (callback) -> @_children.remove callback



  ChildrenDecorator.test = (view) ->
    # make sure children is present, and that it's an object
    return view.has("children") and not view.get("children").__isCollection


  ChildrenDecorator