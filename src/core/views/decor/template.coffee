
define ["./base", "pilot-block"], (BaseViewDecorator, pilot) ->
  
  class TemplateViewDecorator extends BaseViewDecorator

    ###
    ###

    init: () ->
      super()
      @view.loadables.on "displayed", @_onDisplayed

    ###
    ###

    load: (callback) ->  

      @view.template.render @templateData(), (err, content) => 
        return callback(err) if err

        p = @view.section.start

        @view.section.html content
        @view.set "html", @view.section.html()

        # template might have already been compiled, so give a delay
        setTimeout callback, 0

    ###
    ###

    render: (callback) ->
      callback()

    ###
    ###

    display: (callback) ->
      callback()

    ###
    ###

    templateData: () -> { item: @view.getFlatten("item"), section: @view.get("section"), view: @view }

    ###
    ###

    _onDisplayed: () =>
      # @view.el.css { "display": "block" }



  TemplateViewDecorator.test = (view) ->
    return view.template


  TemplateViewDecorator