janitor       = require "janitorjs"

class EventsDecorator

  ###
  ###

  constructor: (@view, @options) ->
    @events = @options
    @view.once "render", @render
    @view.once "dispose", @remove

  ###
  ###

  render: () =>
    e = @_events()
    @_disposeBindings()
    @_janitor = janitor()
    
    for selector of e 
      @_addBinding selector, e[selector]

  ###
  ###

  remove: () =>
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


    elements.bind(lowerActions = actions.toLowerCase(), cb)
    
    for action in lowerActions.split " " then do (action) =>
      @_janitor.add @view.on action, () ->
        cb.apply @, [$.Event(action)].concat Array.prototype.slice.call arguments


    @_janitor.add () ->
      elements.unbind lowerActions, cb
    
  ###
  ###

  _disposeBindings: () ->
    return if not @_janitor
    @_janitor.dispose()
    @_janitor = undefined

  ###
  ###

  _events: () -> @events

  ###
  ###

  @priority   : "display"
  @getOptions : (view) -> view.events
  @decorate   : (view, options) -> new EventsDecorator view, options


module.exports = EventsDecorator

