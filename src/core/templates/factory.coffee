define ["./template", "asyngleton", "underscore"], (Template, asyngleton, _) ->

  
  class TemplateFactory

    ###
    ###

    constructor: (options = {}) ->
      @_engine    = options.engine    or "handlebars"
      @_directory = options.directory or "/templates"
      @_templates = {}

    ###
     Sets the target template engine
    ###

    engine: (value) ->
      return @_engine if not arguments.length
      @_engine = value

    ###
    ###

    directory: (value) ->
      return @_directory if not arguments.length
      @_directroy = value

    ###
    ###

    fromSource: (source, options) -> 
      options.source = source
      @get source, options

    ###
    ###

    get: (name, options = {}) -> 

      _.defaults(options, {
        engine: @_engine,
        directory: @_directory,
        name: name
      })

      @_templates[name] or (@_templates[name] = new Template(options))

