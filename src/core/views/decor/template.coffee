
define ["./base", "outcome"], (BaseViewDecorator, outcome) ->
  
  class TemplateViewDecorator extends BaseViewDecorator

    ###
    ###

    init: () ->
      super()
      @view.loadables.on "displayed", @_onDisplayed

    ###
    ###

    load: (callback) ->  
      @view.get("template").render @templateData(), outcome.e(callback).s (content) => 
        @_html = content
        callback()

    ###
    ###

    render: (callback) ->
      @view.el.css { "visibility": "hidden" }
      @view.el.html @_html
      callback()

    ###
    ###

    display: (callback) ->
      callback()

    ###
    ###

    templateData: () -> 
      @view.get()

    ###
    ###

    _onDisplayed: () =>
      @view.el.css { "visibility": "visible" }



  TemplateViewDecorator.test = (view) ->
    return view.has("template")


  TemplateViewDecorator