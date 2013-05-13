define ["bindable", "../../collection", "../../../utils/compose", "hoist", 
"../../../templates/factory", "dref", "pilot-block", "underscore"], (bindable, ViewCollection, compose, 
  hoist, templates, dref, pilot, _) ->
  
  ###
   this IS the children
  ###

  class

    ###
    ###

    constructor: (@decorator, @options) ->

      @_id      = @name = options._name
      @view     = decorator.view
      @section  = options.section
      @itemName = options.name or "item"
     
      # the source of the list - string
      @__source       = options.source

      # the view class for each item
      @_itemViewClass = options.itemViewClass

      @_viewCollection = @itemViews = new ViewCollection()
      @_viewCollection.bind { insert: @_hookItemView, remove: @_removeItem }

      @_listSection = pilot.createSection()
      @_deferredSections = []

      # throttle the deferred insertions
      @_insertDeferredSections = _.debounce(@_insertDeferredSections, 0)

      @initList()

    ###
    ###

    load: (callback) -> 
      @_viewCollection.load () =>
        @_loaded = true
        @view.set @section, @_listSection.html()
        callback() 

    ###
    ###

    render: (callback) -> @_viewCollection.render callback

    ###
    ###

    display: (callback) -> @_viewCollection.display callback

    ###
    ###

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

      @view.linkChild itemView


      itemView.decorators.push({
        _id: "listItem2"
        load: (callback) ->

          # defer section insertion so we don't kill DOM rendering - this is only a ~1 MS delay.
          # NOT doing this might result in a max call stack issue with FFox, and IE
          if self._loaded and false
            self._deferInsert itemView.section
          else
            self._listSection.append itemView.section

          return callback()
      })

      itemView

    ###
    ###

    _deferInsert: (section) ->  
      @_deferredSections.push(section)
      @_insertDeferredSections()

    ###
    ###

    _insertDeferredSections: () =>
      @_listSection.append @_deferredSections...
      @_deferredSections = []


    ###
    ###

    _removeItem: (itemView) =>
      itemView?.remove()







