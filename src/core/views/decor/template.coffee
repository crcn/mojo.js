
define ["./base", "outcome"], (BaseViewDecorator, outcome) ->
  
  class TemplateViewDecorator extends BaseViewDecorator

    ###
    ###

    load: (callback) ->  
      @view.get("template").render @templateData(), outcome.e(callback).s (content) => 
        @view.set "html", content
        callback()

    ###
    ###

    attach: (callback) ->
      console.log @view.element
      console.log @view.get "html"
      @view.element.html @view.get "html"
      callback()

    ###
    ###

    templateData: () -> 
      @view.get()



  TemplateViewDecorator.test = (view) ->
    return view.has("template")


  TemplateViewDecorator