InternalView = require "../../internal"

class BackboneWrapperView extends InternalView

  ###
  ###

  init: () ->
    super()

    model = @get("model").model ? @get("model")
    view  = null


    @decorators.push 
      load    : (next) => 
        view = new @viewClass { model: model }

        for method in ["emit", "bubble"] then do (method) =>
          view[method] = () => @[method].apply @, arguments

        view.render () =>
          @section.append view.el
          next()
      render  : (next) =>   
        view.el = $(@section.elements)
        view.delegateEvents()
        next()
      display : (next) => next()
      remove  : (next) => next()

module.exports = BackboneWrapperView