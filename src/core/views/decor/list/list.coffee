define ["bindable", "../../collection", "../../../utils/compose", "hoist", "outcome", "../../../templates/factory", "dref"], (bindable, ViewCollection, compose, hoist, outcome, templates, dref) ->
  
  ###
   this IS the children
  ###

  class

    ###
    ###

    constructor: (@decorator, @options) ->



      @_id      = @name = options._name
      @view     = decorator.view
      @selector = options.selector
      @itemName = options.name or "item"

     
      # the source of the list - string
      @__source       = options.source

      # the view class for each item
      @_itemViewClass = options.itemViewClass

      @_viewCollection = @itemViews = new ViewCollection @options.itemViews?.call @view or []
      @_viewCollection.bind { insert: @_hookItemView, remove: @_removeItem }


      @initList()

    ###
    ###

    load: (callback) -> 
      @_loaded = true
      @_viewCollection.load callback

    render: (callback) ->
      @element = if @selector then @view.$ @selector else @view.el
      @_rendered = true
      @_viewCollection.render callback

    display: (callback) ->  
      @_displayed = true
      @_viewCollection.display callback

    remove: (callback) ->
      @binding?.dispose()
      @binding = undefined
      @_viewCollection.remove callback


    ###
    ### 

    initList: () -> 
      hoister = hoist()

      if @options.transform
        hoister.map (item) => @options.transform item, @

      hoister.
      map((item) => 
        ops = {}
        ops.item = item
        ops._id = dref.get(item, "_id")
        ops
      ).
      cast(@_itemViewClass)

      if @__source
        @binding = @view.bind(@__source).collection()

        if @options.filter
          @binding.filter @options.filter

        @binding.transform(hoister).to(@_viewCollection)


    ###
    ###

    _hookItemView: (itemView) =>

      self = @

      itemView.loadables.unshift({
        _id: "listItem"
        render: (callback) ->
          #console.log self._rendered, self._displayed, self._loaded, Date.now().getTime()
          
          self._loadChildTemplate itemView, outcome.e(callback).s (content) =>

            if self.options.prepend
              el = self.element.prepend(content).children().first()
            else
              el = self.element.append(content).children().last()

            itemView.element el

            callback()

        remove: (callback) ->
          itemView.el.remove()
          callback()
      })

      if @_displayed
        itemView.display()

      itemView

    ###
    ###

    _removeItem: (itemView) =>
      itemView?.remove()
    ###
    ###

    _loadChildTemplate: (itemView, callback) ->


      # a template can be defined for the child element - this is nice for items such as select inputs
      if @options.itemTemplate
        template = @options.itemTemplate

      # or an element name can be provided
      else if @options.itemTagName
        template = templates.fromSource("<#{@options.itemTagName} />")

      return callback() if not template

      # load the template with the target child data
      template.render itemView.getFlatten("item") or itemView.getFlatten(), callback








