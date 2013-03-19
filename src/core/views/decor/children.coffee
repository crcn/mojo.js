
define ["./base", "outcome", "../../utils/async"], (BaseViewDecorator, outcome, async) ->
  
  class ChildrenDecorator extends BaseViewDecorator

    ###
    ###

    load: (callback) ->  

      children = @view.get "children"
      @_children = []


      for selector of children
        clazz = children[selector]
        @_children.push { selector: selector, view: new clazz() }



      @_callChildFn "load", callback


    ###
    ###

    attach: (callback) -> @_callChildFn "attach", callback, (child) -> [child.selector]

    ###
    ###

    remove: (callback) -> @_callChildFn "remove", callback

    ###
    ###

    _callChildFn: (name, callback, getArgs) ->

      async.eachSeries @_children, ((child, next) ->

        args = if getArgs then getArgs(child) else []

        child.view[name].apply child.view, args.concat next
      ), callback




  ChildrenDecorator.test = (view) ->

    # make sure children is present, and that it's an object
    return view.has("children") && !view.get("children")._events


  ChildrenDecorator