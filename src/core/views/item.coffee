define ["./base", "../models/base"], (BaseView, BaseModel) ->

  class ItemView extends BaseView

    ###
    ###
    
    init: (options) ->
      
      # if the template changes, re-render
      # @bind "template", @rerender

      options.bind "data.**", @rerender
