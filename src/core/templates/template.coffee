define ["require", "jquery", "asyngleton"], (require, $, asyngleton) ->
  
  class Template

    ###
    ###

    constructor: (@options) ->

      @_engine   = options.engine
      @_baseDir  = options.directory
      @source    = options.source
      @extension = options.extension
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

      return callback null, @source if @source


      # first load the engine
      require ["./engines/#{@_engine}"], (engine) =>

        # then load the template source
        require ["text!#{@_baseDir}/#{@name}.#{@extension || engine.extension}"], (@source) =>  

          # grab the renderer
          @_renderer = engine.compile source

          callback null, source


      @


