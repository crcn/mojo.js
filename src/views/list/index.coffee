bindable  = require "bindable"
type      = require "type-component"
factories = require "factories"
hoist     = require "hoist"
dref      = require "dref"
nofactor  = require "nofactor"

class ListView extends require("../base") 

  ###
  ###

  define: ["filter", "sort", "map", "modelViewFactory", "modelViewClass"] 
  
  ###
  ###

  _init: () ->
    super()
    @_views = new bindable.Collection()
    @_initOptions()
    @_initModelMapper()
    @_initSourceBindings()

    @_rmCount = 0

  ###
  ###

  _initOptions: () ->
    @_filter           = @get("filter")
    @_sort             = @get("sort")
    @_modelViewFactory = @get("modelViewFactory") # TODO
    @_modelViewClass   = @get("modelViewClass")
    @_map              = @get("map")

    if @_modelViewFactory
      @_modelViewFactory = factories.factory(@_modelViewFactory)

  ###
  ###

  _initModelMapper: () ->
    modelViewFactory = @_modelViewFactory ? factories.class(@_modelViewClass)

    hoister = @_mapModel = hoist()

    if @_map
      hoister.map (model) => @_map model, @



    hoister.
    map((model) =>
      ops       = {}
      ops.model = model
      ops._id   = model?.get?("_id") ? model?._id
      ops
    ).map((options) =>
      view = modelViewFactory.create options


      # set the view incase the factory is manual - in which 
      # case the _id might never exist in the view. We won't be able to
      # find a reference to it!
      view.set "_id", options._id

      view
    )

  ###
  ###

  _initSourceBindings: () ->
    @_views.bind("length").to(@, "length").now()
    @_views.bind({ insert: @_insertModelView, remove: @_removeModelView }).now()
    @bind("source").to(@_onSourceOptionChange).now()

  ###
  ###

  _onSourceOptionChange: (source) =>


    @_strSource = source

    @_sourceOptionBinding?.dispose()
    @_sourceOptionBinding = undefined

    if type(source) is "string"
      @_sourceOptionBinding = @bind(source).to(@_onSourceChange).now()
    else
      @_onSourceChange source


  ###
  ###

  _onSourceChange: (@_source) =>

    @_views.source []
    @_deferredSections = []
    @_sourceBinding?.dispose()

    return unless _source

    @_sourceBinding = binding = _source.bind()

    # filter provided?
    if @_filter
      @_sourceBinding.filter (model) =>
        @_watchModelChanges model
        @_filter model, @


    binding.map(@_mapModel).to(@_views).now()
    @_watchViewChanges()

  ###
  ###

  _watchModelChanges: (model) ->

    removeListener = () -> 
      model.removeListener "change", _onSourceChange

    model.on "change", onChange = () => @_refilter [model]



  _watchViewChanges: () ->
    return if @_watchingViewChanges
    return if not @_bind or not @_filter

    @_watchingViewChanges = true

    for property in @_bind then do (property) =>
      @bind(property).to () => @_refilter @_source.source()

  ###
  ###

  _refilter: (models) ->

    for model in models

      useModel      = !!@_filter(model, @)
      modelIndex    = @_views.indexOf({ _id: model.get("_id") })
      containsModel = !!~modelIndex

      continue if useModel is containsModel

      if useModel
        @_views.push @_mapModel model
      else

        # note ~ @remove is overwritten, so we need to 
        # fetch the object, and remove it manually
        @_views.splice(modelIndex, 1)

    @_resort()

  ###
  ###

  _insertModelView: (modelView, index) =>

    @setChild index, modelView
    modelView.render()

    if @_rendered
      @_deferInsert modelView.section.toFragment()
    else
      @section.append modelView.section.toFragment()
      @_resort()

  ###
  ###

  _deferInsert: (section) ->  
    @_deferredSections.push(section)
    clearTimeout @_deferInsertTimeout
    @_deferInsertTimeout = setTimeout @_insertDeferredSections, 0

  ###
  ###

  _insertDeferredSections: () =>
    @section.append nofactor.default.createFragment @_deferredSections
    @_resort()
    @_deferredSections = []

  ###
  ###

  _removeModelView: (modelView) =>
    modelView.dispose()


  ###
  ###

  _resort: () ->
    return unless @_sort
    frag = []

    sorted = @_views.source().sort @_sort
    for view in sorted
      frag.push view.section.toFragment()

    @section.append nofactor.default.createFragment frag




module.exports = ListView