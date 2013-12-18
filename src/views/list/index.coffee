bindable  = require "bindable"
type      = require "type-component"
factories = require "factories"
hoist     = require "hoist"
dref      = require "dref"
janitor   = require "janitorjs"

###
###

class ListView extends require("../base") 

  ###
  ###

  __isList: true

  ###
  ###

  define: ["filter", "sort", "map", "length", "modelViewFactory", "modelViewClass", "viewClass"] 
  
  ###
  ###

  initialize: (data) ->
    super data
    
    @_views = new bindable.Collection()
    @_initOptions()
    @_initModelMapper()
    @_initSourceBindings()

  ###
  ###

  _render: () ->
    super()
    @_viewBinding?.dispose()
    @_sourceBinding?.dispose()
    @_sortBinding?.dispose()
    @_filterBinding?.dispose()
    @_viewBinding = @_views.bind({ insert: @_insertModelView, remove: @_removeModelView }).now()
    @_filterBinding  = @bind("filter").to(@_onFilterOptionChange).now()
    @_sourceBinding = @bind("source").to(@_onSourceOptionChange).now()
    @_sortBinding  = @bind("sort").to(@_onSortOptionChange).now()

  ###
  ###

  _initOptions: () ->
    if @modelViewFactory
      @_modelViewFactory = factories.factory.create(@modelViewFactory)

  ###
  ###

  _initModelMapper: () ->
    modelViewFactory = @_modelViewFactory ? factories.class(@modelViewClass ? @viewClass)

    hoister = @_mapModel = hoist()

    if @map
      hoister.map (model) => @map model, @


    hoister.
    map((model) =>

      ops       = {}
      ops.model = model

      unless model?.get?("_id")
        model?.set?("_id", Date.now() + "_" + Math.random() * 999999)

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

  _onSourceChange: (_source) =>


    if type(_source) is "array"
      _source = new bindable.Collection _source


    @_source = _source


    @_views.source []
    @_deferredSections = []
    @_sourceJanitor?.dispose()

    return unless _source

    @_sourceJanitor = janitor()

    @_sourceJanitor.add @_sourceBinding = binding = _source.bind()

    # filter provided?
    if @_filter
      @_sourceBinding.filter (model) =>
        @_sourceJanitor.add @_watchModelChanges model
        @_filter model, @



    binding.map(@_mapModel).to(@_views).now()


  ###
  ###

  _onSortOptionChange: (sort) =>
    @_sortOptionBinding?.dispose()
    if type(sort) is "string"
      @_sortOptionBinding = @bind(sort).to(@_onSortChange).now()
    else
      @_onSortChange sort

  ###
  ###

  _onSortChange: (sort) =>
    @_sort = sort
    @_resort()

  ###
  ###

  _onFilterOptionChange: (filter) =>
    @_filterOptionBinding?.dispose()
    if type(filter) is "string"
      @_filterOptionBinding = @bind(filter).to(@_onFilterChange).now()
    else
      @_onFilterChange filter

  ###
  ###

  _onFilterChange: (filter) =>
    @_filter = filter

    return unless @_source
    @_refilter @_source.source()


  ###
  ###

  _watchModelChanges: (model) ->
    model.on "change", onChange = () => @_refilter [model]

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


  ###
  ###

  _insertModelView: (modelView, index) =>

    modelView.set "parent", @
    modelView.render()

    @section.append modelView.section.toFragment()
    @_resort()

  ###
  ###

  _removeModelView: (modelView) =>
    modelView.dispose()

  ###
  ###

  dispose: () ->
    super()
    @_sourceOptionBinding?.dispose()
    @_sourceJanitor?.dispose()


  ###
  ###

  _resort: () ->
    return unless @_sort
    frag = []

    sorted = @_views.source().sort @_sort
    for view in sorted
      frag.push view.section.toFragment()

    @section.append @application.nodeFactory.createFragment frag




module.exports = ListView