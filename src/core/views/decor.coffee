
define ["./base"], (BaseView) ->
  

  class DecorView extends BaseView

    ###
    ###

    init: (options) ->

      options.defaults {
        childElement: ".view"
      }

      @_view = options.get "view"

      
      @glue "modelLocator", @_view, "modelLocator"


    ###
    ###

    attach: (element, callback) ->
      super.attach element, () =>
        @_view.attach @get("children"), callback



