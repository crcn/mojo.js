define ["./base"], (BaseDecor) ->
  
  ###
   preloads a model, or set of models before 
  ###
  
  class PreloadDecorator extends BaseDecor

    ###
    ###

    load: (next) ->
      model = @view.get("model") ? @view.get("item")
      return next() if not model or not model?.fetch
      model.fetch next


  PreloadDecorator.getOptions = (view) -> view.preload

  PreloadDecorator