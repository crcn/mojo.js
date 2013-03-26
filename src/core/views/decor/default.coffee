
define ["./base", "outcome"], (BaseViewDecorator, outcome) ->
  
  class TemplateViewDecorator extends BaseViewDecorator

    ###
    ###

    attach: (callback) ->
      @view.emit "rendered"
      callback()



  TemplateViewDecorator.test = (view) -> true


  TemplateViewDecorator