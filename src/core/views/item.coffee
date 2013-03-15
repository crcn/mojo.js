define ["./base", "../models/base"], (BaseView, BaseModel) ->

  class ItemView extends BaseView

    ###
    ###

    constructor: (options = {}) ->
      super options
      @source options.data or {}

    ###
    ###

    source: (value) ->  
      return @_target if not arguments.length

      if not value
        value = {}

      if @_updateListener 
        @_updateListener.dispose()

      # if the item is a regular object, then turn it into a model
      @_target = if value.hasOwnProperty("get") then value else new BaseModel(value)

      #re-render the template after the item changes
      @_updateListener = @_target.on "update", @_onTargetUpdate

    ###
    ###

    templateData: () -> @_target.get()

    ###
    ###

    _onTargetUpdate: () =>
      console.log @_target.get()
      @rerender()
