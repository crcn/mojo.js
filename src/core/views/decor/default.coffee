
define ["./base", "outcome"], (BaseViewDecorator, outcome) ->
  
  class TemplateViewDecorator extends BaseViewDecorator

    ###
    ###

    attach: (callback) ->
      @view.emit "ready"
      callback()



  TemplateViewDecorator.test = (view) -> true


  TemplateViewDecorator