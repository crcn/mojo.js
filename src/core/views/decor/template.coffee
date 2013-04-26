
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

      @view.template.render @templateData(), (err, content) => 
        return callback(err) if err
        @_html = content

        # the view might have been initialized immediately, so add a 1 MS timeout incase
        # there's anything else that needs to initialize the view
        setTimeout callback, 1

    ###
    ###

    render: (callback) ->
      @view.el.css { "display": "none" }
      @view.el.html @_html
      # need to give the browser some breathing room to render (FFOX throws recursive error)
      setTimeout callback, 0

    ###
    ###

    display: (callback) ->
      callback()


    ###
    ###

    templateData: () -> @view.getFlatten("item") or @view.getFlatten()

    ###
    ###

    _onDisplayed: () =>
      @view.el.css { "display": "block" }



  TemplateViewDecorator.test = (view) ->
    return view.template


  TemplateViewDecorator