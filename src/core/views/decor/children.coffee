
define ["./base", "outcome", "../../utils/async", "../collection", "pilot-block"], (BaseViewDecorator, outcome, async, Collection, pilot) ->
  
  class ChildrenDecorator extends BaseViewDecorator

    ###
    ###

    init: () ->
      super()
      childrenClasses = @view.children
      @_children = new Collection()
      @_childrenByName = {}

      # modalBody .modal-body
      for property of childrenClasses

        clazz = childrenClasses[property]
        child = new clazz()

        # make the views accesible from the selectors
        @_children[property] = @_childrenByName[property] = child
        @view.set property, child
        @view.linkChild child
        @_children.push child

    ###
    ###

    load: (callback) ->  
      @view.children = @view.children = @_children
      @_children.load (err) =>
        return callback(err) if err?
        for childName of @_childrenByName
          @view.set "section.#{childName}", @_childrenByName[childName].section.html()
        callback()

    ###
    ###

    render: (callback) -> @_children.render callback

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