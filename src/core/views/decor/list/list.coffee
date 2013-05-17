define ["bindable", "../../collection", "../../../utils/compose", "hoist", 
"../../../templates/factory", "dref", "pilot-block", "underscore", "../../adapters/index", "events", "../sectionable/decor"], (bindable, ViewCollection, compose, 
  hoist, templates, dref, pilot, _, adapters, events, SectionableDecor) ->
  
  ###
   this IS the children
  ###

  class extends SectionableDecor

    ###
    ###

    constructor: () ->
      super arguments...
     
      # the source of the list - string, or object
      @__source       = @options.source

      # the view class for each item
      @_itemViewClass = adapters.getViewClass @options.itemViewClass

      @_viewCollection = @itemViews = new ViewCollection()
      @_viewCollection.bind { insert: @_hookItemView, remove: @_removeItemView }

      @_deferredSections = []
      @initList()



    ###
    ###

    _load: (callback) -> 
      @_fetchRemote () =>
        @_viewCollection.load callback

    ###
    ###

    _fetchRemote: (next) -> 
      return next() if @_viewCollection.length() or not @_sourceCollection?.fetch
      @_sourceCollection?.fetch next

    ###
    ###

    render: (callback) -> @_viewCollection.render callback

    ###
    ###

    display: (callback) -> @_viewCollection.display callback

    ###
    ###

    remove: (callback) ->
      @_sourceBinding?.dispose()
      @_sourceBinding = undefined
      @_viewCollection.remove callback

    ###
    ### 

    initList: () -> 
      hoister = hoist()

      if @options.transform
        hoister.map (item) => @options.transform item, @

      @_itemTransformer = hoister.
      map((item) => 
        ops = {}
        ops.item = item
        ops._id = dref.get(item, "_id")
        ops
      ).
      cast(@_itemViewClass)

      @_bindSource()


    ###
    ###

    _onSourceChange: (source) => 


      @_viewCollection.source []
      @_deferredSections = []

      # might be a bindable.Collection / backbone / spine collection
      @_sourceCollection = adapters.getCollection source


      @_sourceBinding?.dispose()
      @_sourceBinding = binding = @_sourceCollection.bind()

      if @options.filter
        @_sourceBinding.filter @options.filter

      binding.transform(@_itemTransformer).to(@_viewCollection)

    ###
    ###

    _bindSource: () ->
      return if not @__source
      if typeof @__source is "string"
        @_bindSourceString()
      else
        @_bindSourceInst()

    ###
    ###

    _bindSourceString: () -> @view.bind(@__source, @_onSourceChange)

    ###
    ###

    _bindSourceInst: () ->
      @_onSourceChange @__source

    ###
    ###

    _hookItemView: (itemView) =>

      self = @

      @view.linkChild itemView

      itemView.decorators.push
        load: (callback) ->


          # defer section insertion so we don't kill DOM rendering - this is only a ~1 MS delay.
          # NOT doing this might result in a max call stack issue with FFox, and IE
          if self._loaded
            self._deferInsert itemView.section
          else
            self.section.append itemView.section

          callback()
      

      itemView

    ###
    ###

    _deferInsert: (section) ->  
      @_deferredSections.push(section)
      @_deferInsert2()

    ###
    ###

    _deferInsert2: () ->
      clearTimeout @_deferInsertTimeout
      @_deferInsertTimeout = setTimeout @_insertDeferredSections, 0

    ###
    ###

    _insertDeferredSections: () =>
      @section.append @_deferredSections...
      @_deferredSections = []

    ###
    ###

    _removeItemView: (itemView) => 
      return if not itemView
      itemView.dispose()







