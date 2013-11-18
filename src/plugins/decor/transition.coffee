comerr = require "comerr"
BaseViewDecorator = require "./base"
_ = require "underscore"
async = require "../../utils/async"


class TransitionDecorator extends BaseViewDecorator

  ###
  ###

  constructor: (@view, @transition) ->
    @view.once "render"  , @_onRender
    @view.once "remove"  , @_onRemove


  ###
  ###

  _onRender: () =>
    @_transitionAll "enter", () ->

  ###
  ###

  _onRemove: () =>
    @view.$().css({opacity:1})
    @view.callstack.push (next) =>
      @_transitionAll "exit", next

  ###
  ###

  _transitionAll: (type, next) ->
    async.forEach @_filterTransitions(type), ((transition, next) =>
      @_transition @_element(transition), transition[type], next
    ), next

  ###
  ###

  _transition: (element, transition, next) ->
    # if the element doesn't exist, then return an error
    return next(new comerr.NotFound("element does not exist")) if not element.length

    if transition.from
      element.css transition.from

    setTimeout (() =>
      element.transit transition.to or transition, next
    ), 0

  ###
  ###

  _transitions: () ->
    transition = @transition
    if transition.enter or transition.exit
      return [transition]

    transitions = []

    for selector of transition
      trans = transition[selector]
      trans.selector = selector
      transitions.push trans

    console.log transitions

    transitions

  ###
  ###

  _filterTransitions: (type) ->
    return @_transitions().filter (trans) -> !!trans[type]

  ###
  ###

  _element: (transition) -> 
    selector = transition.selector or transition.el
    element = if selector then @view.$(selector) else @view.$()
    element.filter (index, element) ->
      element.nodeType is 1

  ###
  ###

  @priority   : "display"
  @getOptions : (view) -> view.transition
  @decorate   : (view, options) -> new TransitionDecorator view, options

 

module.exports = TransitionDecorator