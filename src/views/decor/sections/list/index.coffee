ViewCollection = require "../../../collection"
adapters       = require "../../../adapters/index"
dref           = require "dref"
hoist          = require "hoist"
pilot          = require "pilot-block"
bindable       = require "bindable"
type           = require "type-component"
FnFactory      = require "../../../../factories/fn"
ClassFactory   = require "../../../../factories/class"

  
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
    @rendered = true
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
    #next()

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
    ).map((options) =>
      view = modelViewFactory.create options

      # set the view incase the factory is manual - in which 
      # case the _id might never exist in the view. We won't be able to
      # find a reference to it!
      view.set "_id", options._id
      
      @_hookModelView view
      view
    )

    @_bindSource()

  ###
  ###

  _onSourceChange: (source) => 


    @_viewCollection.source []
    @_deferredSections = []

    @_sourceBinding?.dispose()

    return unless source

    # might be a bindable.Collection / backbone / spine collection
    @_sourceCollection = adapters.getCollection source


    @_sourceBinding = binding = @_sourceCollection.bind()

    @_sourceBinding.filter (model) => 
      return true unless @options.filter
      @_watchModelChanges model
      @_filter(model)

    binding.map(@_modelTransformer).to(@_viewCollection).now()
    @_watchViewChanges()

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
          if self.options.prepend
            self.section.prepend modelView.section
          else
            self.section.append modelView.section


        next()


    

    modelView

  ###
  ###

  _watchModelChanges: (model) ->
    return unless @options.filter

    removeListener = () ->
      model.removeListener "change", onChange

    model.on "change", onChange = () => @_refilter [model]

  ###
  ###

  _watchViewChanges: () ->
    return if @_watchingViewChanges
    return if not @options.bind or not @options.filter

    @_watchingViewChanges = true

    for property in @options.bind then do (property) =>
      @view.bind(property).to () => @_refilter @_sourceCollection.source()


  ###
  ###

  _refilter: (models) ->
    for model in models

      useModel      = !!@_filter(model)
      modelIndex    = @_viewCollection.indexOf({ _id: model.get("_id") })
      containsModel = !!~modelIndex

      continue if useModel is containsModel

      if useModel
        @_viewCollection.push @_modelTransformer model
      else

        # note ~ @remove is overwritten, so we need to 
        # fetch the object, and remove it manually
        @_viewCollection.splice(modelIndex, 1)



  ###
  ###

  _filter: (model) -> @options.filter.call @view, model


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

module.exports = ListSection