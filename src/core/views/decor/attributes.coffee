define ["disposable", "./base"], (disposable, BaseDecorator) ->
  
  class EventsDecorator extends BaseDecorator


    ###
    ###

    attach: (callback) ->
      for props in @_properties()
        for key of props.attributes
          props.element.attr(key, props.attributes[key])

      callback()


    ###
    ###

    _properties: () ->
      attrs = @view.get "attributes"

      attrElement = @_targetElement()

      if typeof @_firstValue(attrs) isnt "object"
        return [{
          element: attrElement,
          attributes: attrs
        }]

      elements = []

      for selector of attrs
        elements.push {
          element: attrElement.find(selector),
          attributes: attrs[selector]
        }

    ###
    ###

    _firstValue: (attrs) ->
      for key of attrs
        return attrs[key]


    ###
    ###

    _targetElement: () ->
      return @view.element if not @view.has "attributesElement"
      return @view.$ @view.get "attributesElement"


  EventsDecorator.test = (view) ->
    view.has "attributes"

  EventsDecorator