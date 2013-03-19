define ["require", "asyngleton", "outcome"], (require, asyngleton, outcome) ->
  
  class Template

    ###
    ###

    constructor: (@options) ->

      @_engine   = options.engine
      @_baseDir  = options.directory
      @source    = options.source
      @extension = options.extension
      @factory   = options.factory
      @name      = options.name

    ###
     renders the template with the given options
    ###

    render: (options, callback) ->

      # load will be skipped if the template is already loaded
      @load () => 
        @_renderer.render options, callback

      @
      

    ###
     Loads the template source
    ###

    load: asyngleton (callback) ->

      # first load the engine
      @factory.loadEngine @_engine, outcome.s (engine) =>

        onSource = (@source) =>

          # grab the renderer
          @_renderer = engine.compile source

          callback null, source


        if @source
          return onSource @source

        @_loadFromFile onSource


      @


    ###
    ###

    _loadFromFile: (callback) ->
      require ["text!#{@_baseDir}/#{@name}.#{@extension || engine.extension}"], callback




