
define ["./base", 
"outcome", 
"../../utils/async", 
"bindable",
"../../factories/class",
"../collection",
"../../templates/factory"], (BaseViewDecorator, outcome, async, bindable, ClassFactory, Collection, templates) ->
  
  class ListChildrenDecorator extends BaseViewDecorator


    ###
    ###

    load: (callback) ->  

      @_children = new Collection @view.get "children"


      if @view.get "source"
        binding = @view.get("source").bind()

        # child view class provided? children 
        if @view.get "childViewClass"
          factory = new ClassFactory @view.get "childViewClass"
          binding.transform (item) -> 
            factory.createItem item

        binding.to @_children

      
      @_children.load outcome.e(callback).s () =>

        @_children.on 
          insert: @_insertChild
          remove: @_removeChild

        callback.apply this, arguments

    ###
    ###

    render: (callback) -> 
      async.eachSeries @_children.source(), ((child, next) =>

        @_addChildElement child, outcome.e(next).s (element) =>
          child.element element
          next()

      ), outcome.e(callback).s () =>
        @_children.render callback

    ###
    ###

    display: (callback) -> 
      @_children.display () =>
        @_loaded = true
        callback()

    ###
    ###

    _insertChild: (item, index) =>
      @_addChild item

    ###
    ###

    _removeChild: (item, index) =>
      item.remove()
      item.el.remove()

    ###
    ###

    _addChild: (child, next = (() ->)) ->

      child.loadables.unshift {
        _id: "loadable",
        load: (next) =>
          @_addChildElement child, outcome.e(next).s (element) ->
            child.element element
            next()
      }

      if @_loaded
        child.display next

    ###
    ###

    _addChildElement: (child, callback) ->


      # a template can be defined for the child element - this is nice for items such as select inputs
      if @view.get("childTemplate")
        template = @view.get("childTemplate")

      # or an element name can be provided
      else if @view.get("childElement")
        template = templates.fromSource("<#{@view.get("childElement")} />")

      # load the template with the target child data
      template.render child.get(), outcome.e(callback).s (content) =>
        callback null, @_childrenElement().append(content).children().last()


    ###
    ###

    _childrenElement: () -> 

      return @view.el if not @view.has "childrenElement"

      @view.$ @view.get "childrenElement"



  ListChildrenDecorator.test = (view) ->
    return view.has("children") and view.get("children").__isCollection


  ListChildrenDecorator