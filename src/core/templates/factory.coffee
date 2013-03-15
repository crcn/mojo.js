define ["./template", "asyngleton"], (Template, asyngleton) ->


  
  class TemplateFactory

    ###
    ###

    constructor: (options = {}) ->
      @_engine = options.engine or "handlebars"
      @_templates = {}


    ###
     Sets the target template engine
    ###

    engine: (value) ->
      return @_engine if not arguments.length
      @_engine = value

    ###
    ###

    get: (name) -> @_templates[name] or (@_templates[name] = new Template(@, name))

