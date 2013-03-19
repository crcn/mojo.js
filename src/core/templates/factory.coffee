define ["require", "./template", "asyngleton", "underscore"], (require, Template, asyngleton, _) ->

  
  class TemplateFactory

    ###
    ###

    constructor: (options = {}) ->
      @_engine    = options.engine    or "handlebars"
      @_directory = options.directory or "/templates"
      @_extension = options.extension
      @_templates = {}
      @_loadedEngines = {}
      @plugins = []

    ###
     Sets the target template engine
    ###

    engine: (value) ->
      return @_engine if not arguments.length
      @_engine = value


    ###
    ###

    use: (plugin) -> @plugins.push plugin

    ###
    ###

    directory: (value) ->
      return @_directory if not arguments.length
      @_directroy = value

    ###
    ###

    fromSource: (source, options = {}) -> 
      options.source = source
      @get source, options

    ###
    ###

    loadEngine: (name, callback) ->
      require ["./engines/#{@_engine}"], (Engine) =>
        callback null, (@_loadedEngines[name] or (@_loadedEngines[name] = new Engine(@)))



    ###
    ###

    get: (name, options = {}) -> 

      _.defaults(options, {
        engine: @_engine,
        directory: @_directory,
        extension: @_extension,
        plugins: @plugins,
        factory: @,
        name: name
      })

      @_templates[name] or (@_templates[name] = new Template(options))


  mainFactory = new TemplateFactory()
  TemplateFactory.fromSource = () -> mainFactory.fromSource.apply mainFactory, arguments

  TemplateFactory

