
define ["./base"], (BaseView) ->
  

  class DecorView extends BaseView

    ###
    ###

    init: (options) ->

      options.defaults {
        childElement: ".view"
      }

      @_view = options.get "view"


    


    ###
    ###

    _attached: () ->
      @_view.attach @get("childElement")
