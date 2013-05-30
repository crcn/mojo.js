define ["disposable", "./base"], (disposable, BaseDecorator) ->
  
  class AttributesDecorator extends BaseDecorator

    ###
    ###
    
    init: () ->
      super()
      @attrs = @options

    ###
    ###

    render: () ->
      for props in @_properties()
        for key of props.attributes
          props.element.attr(key, props.attributes[key])

    ###
    ###

    _properties: () ->
      attrs = @attrs

      attrElement = @_targetElement()

      if typeof @_firstValue(attrs) isnt "object"
        return [{
          element: attrElement,
          attributes: attrs
        }]

      elements = []

      for selector of attrs
        elements.push 
          element    : attrElement.find(selector),
          attributes : attrs[selector]

    ###
    ###

    _firstValue: (attrs) ->
      for key of attrs
        return attrs[key]

    ###
    ###

    _targetElement: () -> @view.$()


  AttributesDecorator.getOptions = (view) -> view.attributes

  AttributesDecorator