
define ["./html", "outcome"], (HtmlViewDecorator, outcome) ->
  
  class TemplateViewDecorator extends HtmlViewDecorator


    ###
    ###

    setup: (callback) ->  
      @view.get("template").render @templateData(), outcome.e(callback).s (content) =>
        @view.element.html content
        callback()



    ###
    ###

    templateData: () -> @view.get()





  TemplateViewDecorator.test = (view) ->
    return view.has("template")


  TemplateViewDecorator