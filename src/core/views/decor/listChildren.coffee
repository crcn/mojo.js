
define ["./base", 
"outcome", 
"../../utils/async", 
"bindable",
"../../factories/class",
"../collection",
"../../templates/factory", "hoist"], (BaseViewDecorator, outcome, async, bindable, ClassFactory, Collection, templates, hoist) ->
  
  class ListChildrenDecorator extends BaseViewDecorator


    ###
    ###

    load: (callback) ->  

      @_children = new Collection @view.get "children"

      if @view.has "source"
        binding = @view.get("source").bind()
        binding.transform transformer = hoist()

        if @view.get "transformSourceItem"
          transformer.map @view.get "transformSourceItem" 

        # child view class provided? children 
        if @view.get "childViewClass"
          factory = new ClassFactory @view.get "childViewClass"
          transformer.map (item) => factory.createItem item

        binding.to @_children

      @_children.load callback

    ###
    ###

    render: (callback) -> 

      @_children.on 
        insert: @_insertChild
        remove: @_removeChild
        
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