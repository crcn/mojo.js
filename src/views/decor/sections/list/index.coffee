define ["../../../collection", 
  "../../../adapters/index", 
  "dref", 
  "hoist", 
  "pilot-block", 
  "bindable",
  "type-component", 
  "../../../../factories/fn", 
  "../../../../factories/class"], (ViewCollection, adapters, dref, 
    hoist, pilot, bindable, type, FnFactory, ClassFactory) ->
  
  class ListSection extends bindable.Object
    constructor: (@view, @name, @options) ->
      super()

      # the source of the list - string, or object
      @__source       = @options.source

      @_viewCollection = @modelViews = new ViewCollection()
      @_viewCollection.bind({ remove: @_removeModelView }).now()

      @_deferredSections = []
      @section = pilot.createSection()

      @_viewCollection.bind("length").to(@, "length")

    ###
    ###

    toString: () -> 
      @section.toString()


    load: (next) ->

      # init the list on load so property bindings
      # can be properly inherited
      @initList()

      @_fetchRemote () =>
        @_viewCollection.load next

    ###
    ###

    _fetchRemote: (next) -> 
      return next() if not @_sourceCollection?.fetch
      @_sourceCollection?.fetch next

    ###
    ###

    render: (next) -> @_viewCollection.render next

    ###
    ###

    display: (next) -> @_viewCollection.display next

    ###
    ###

    remove: (next) ->
      @_sourceBinding?.dispose()
      @_sourceBinding = undefined
      @_viewCollection.remove next

    ###
    ### 

    initList: () -> 
      hoister = hoist()
      map = @options.map or @options.transform

      modelViewFactory = @options.modelViewFactory or new ClassFactory adapters.getViewClass @options.modelViewClass

      # must turn it into a factory
      if type(modelViewFactory) is "function"
        modelViewFactory = new FnFactory modelViewFactory

      if map
        hoister.map (model) => map model, @

      @_modelTransformer = hoister.
      map((model) => 
        ops       = {}
        ops.model = model
        ops._id   = dref.get(model, "_id")
        ops
      ).map((model) =>
        view = modelViewFactory.create model
        @_hookModelView view
        view
      )

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

      binding.transform(@_modelTransformer).to(@_viewCollection).now()

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

    _bindSourceString: () -> @view.bind(@__source, @_onSourceChange).now()

    ###
    ###

    _bindSourceInst: () ->
      @_onSourceChange @__source

    ###
    ###

    _hookModelView: (modelView) =>

      self = @

      @view.linkChild modelView

      modelView.decorators.push
        load: (next) ->


          # defer section insertion so we don't kill DOM rendering - this is only a ~1 MS delay.
          # NOT doing this might result in a max call stack issue with FFox, and IE
          if self._loaded
            self._deferInsert modelView.section
          else
            self.section.append modelView.section


          next()
      

      modelView

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

    _removeModelView: (modelView) => 
      return if not modelView
      modelView.remove()

    @test: (options) -> options.type is "list"

  ListSection