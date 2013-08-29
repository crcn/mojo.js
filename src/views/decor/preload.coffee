BaseDecor = require "./base"
async     = require "async"
toarray   = require "toarray"
  
###
 preloads a model, or set of models before 
###

class PreloadDecorator extends BaseDecor

  ###
  ###

  constructor: (@view, preload) ->

    if preload is true
      pl = ["model"]
    else
      pl = preload

    @preload = toarray pl

  ###
  ###

  load: (next) ->

    async.forEach @preload, ((property, next) =>

      # bind incase the value doesn't exist yet
      @view.bind(property).to((model) =>
        return next() if not model or not model?.fetch
        model.fetch next
      ).once().now()

    ), next


PreloadDecorator.getOptions = (view) -> view.preload

module.exports = PreloadDecorator