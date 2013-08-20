InternalView  = require "./internal"
DecorFactory  = require "./decor/factory"

class BaseView extends InternalView

  ###
   expose this so third-party modules can add a decorator
  ###

  @addDecoratorClass: DecorFactory.addDecoratorClass

  ###
  ###
  
  _initDecor: () ->
    super()
    DecorFactory.setup @

  ###
   dynamically added decorators
  ###

  decorate: (options) ->
    DecorFactory.setup @, options


module.exports = BaseView