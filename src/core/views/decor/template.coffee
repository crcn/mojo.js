
define ["./base", "pilot-block"], (BaseViewDecorator, pilot) ->
  
  class TemplateViewDecorator extends BaseViewDecorator

    ###
    ###

    load: (callback) ->  

      @view.template.render @templateData(), (err, content) => 
        return callback(err) if err

        p = @view.section.start

        @view.section.html content
        @view.set "html", @view.section.html()

        # template might have already been compiled, so give a delay
        callback()

    ###
    ###

    templateData: () -> { item: @view.getFlatten("item"), section: @view.get("section"), view: @view }




  TemplateViewDecorator.test = (view) ->
    return view.template


  TemplateViewDecorator