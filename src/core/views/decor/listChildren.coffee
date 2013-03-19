
define ["./base", 
"outcome", 
"../../utils/async", 
"../../collections/concrete", 
"../../factories/class",
"../../templates/factory"], (BaseViewDecorator, outcome, async, Collection, ClassFactory, templates) ->
  
  class ListChildrenDecorator extends BaseViewDecorator


    ###
    ###

    load: (callback) ->  

      @_children = children = @view.get "children"
      @_intermediate = new Collection()


      # child view class provided? children 
      if @view.get "childViewClass"
        @_intermediate.itemFactory new ClassFactory @view.get "childViewClass"
        @_intermediate.glue @_children

      if @view.get "source"
        @view.get("source").glue @_intermediate



      async.eachSeries @_children.source(), ((child, next) =>
        @_loadChild child, next
      ), outcome.e(callback).s () =>
        @_children.on "updated", @_onChildrenUpdated
        callback.apply this, arguments

    ###
    ###

    attach: (callback) -> 
      async.eachSeries @_children.source(), ((child, next) =>
        @_addChild child, next
      ), callback

    ###
    ###

    remove: (callback) -> 
      async.eachSeries @_children.source(), ((child, next) ->
        child.remove next
      ), callback

    ###
    ###

    _onChildrenUpdated: (event) =>
      return if event.type isnt "add"
      item = event.item
      @_addChild item

    ###
    ###

    _addChild: (child, next = (() ->)) ->

      return if @_loading

      @_loadChild child, () =>
        child.attach @_childrenElement().append(child.get("parentTplContent")).children().last()
        next()

    ###
    ###

    _loadChild: (child, callback) ->

      # return if the child has already been loaded
      return callback() if child.has "parentTplContent"

      # a template can be defined for the child element - this is nice for items such as select inputs
      if @view.get("childTemplate")
        template = @view.get("childTemplate")

      # or an element name can be provided
      else if @view.get("childElement")
        template = templates.fromSource("<#{@view.get("childElement")} />")

      # load the template with the target child data
      template.render child.get(), outcome.e(callback).s (content) =>
        child.set "parentTplContent", content
        child.load callback


    ###
    ###

    _childrenElement: () -> 

      return @view.element if not @view.has "childrenElement"

      @view.element.find @view.get "childrenElement"



  ListChildrenDecorator.test = (view) ->
    return view.has("children") and view.get("children")._events


  ListChildrenDecorator