
class SelectorDecorator  

  ###
  ###

  @getOptions : (view) -> !!view.prototype
  @decorate   : (view) ->

    view.$ = (search) -> 

      # a little overhead, but we need to re-scan the elements
      # each time $() is called
      el = $ @section.getChildNodes()

      if arguments.length
        return el.find search

      return el
 


module.exports = SelectorDecorator
