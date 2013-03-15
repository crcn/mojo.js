Mixins act a bit like plugins for objects. It's basically a glorified composite pattern.

```coffeescript

class ViewMixins extends Mixins

  ###
  ###

  constructor: () ->
    @mixins = 


class SomeView extends BaseView

  ###
  ###

  init: (options) ->
    super options
    @_mixins = new ViewMixins @, options


  ###
  ###

  attach: (element, callback) ->
    @_mixins.setup @, callback


  ###
  ###

  remove; (element, callback) ->
    @_mixins.teardown callback


```