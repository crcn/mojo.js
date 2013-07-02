disposable = require "disposable"
BaseDecorator = require "./base"



class EventsDecorator extends BaseDecorator

  ###
  ###

  init: () ->
    super()
    @events = @options

  ###
  ###

  render: () ->
    e = @_events()
    @_disposeBindings()
    @_disposable = disposable.create()

    for selector of e 
      @_addBinding selector, e[selector]

  ###
  ###

  remove: () ->
    @_disposeBindings()

  ###
  ###

  _addBinding: (selector, viewMethod) ->

    selectorParts = selector.split " "
    actions = selectorParts.shift().split(/\|/g).join(" ")
    selectors = selectorParts.join(",")

    cb = () =>

      if typeof viewMethod is "function"
        ref = viewMethod
      else 
        ref = @view[viewMethod] or @view.get viewMethod

      ref.apply(@view, arguments)


    if !selectors.length
      elements = @view.$()
    else
      elements = @view.$(selectors)


    elements.bind(actions.toLowerCase(), cb)
    for action in actions.split " " then do (action) =>
      @_disposable.add @view.on action, () ->
        cb.apply @, [$.Event(action)].concat Array.prototype.slice.call arguments


    @_disposable.add () ->
      elements.unbind actions, cb
    
  ###
  ###

  _disposeBindings: () ->
    return if not @_disposable
    @_disposable.dispose()
    @_disposable = undefined

  ###
  ###

  _events: () -> @events


  @getOptions = (view) -> view.events


module.exports = EventsDecorator

