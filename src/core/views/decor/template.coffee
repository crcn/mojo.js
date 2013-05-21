define ["./base", "pilot-block"], (BaseViewDecorator, pilot) ->
  
  class TemplateViewDecorator extends BaseViewDecorator

    ###
    ###

    init: () ->
      super()
      @template = @options

    ###
    ###

    load: (callback) ->  
      @template.render @templateData(), (err, content) => 
      
        return callback(err) if err

        p = @view.section.start

        @view.section.html content
        @view.set "html", @view.section.html()

        # template might have already been compiled, so give a delay
        callback()

    ###
    ###

    templateData: () -> 
      model = @view.getFlatten("model") ? @view.getFlatten("item")

      # DEPRECATED
      item    : model
      model   : model
      section : @view.get("section") 
      view    : @view 




  TemplateViewDecorator.getOptions = (view) -> view.template


  TemplateViewDecorator