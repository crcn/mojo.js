define ["require", "jquery", "events"], (require, $, events) ->
  
  class Template extends events.EventEmitter

    ###
    ###

    constructor: (@options) ->

      @_engine  = options.engine
      @_baseDir = options.directory
      @name     = options.name



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

    load: (callback = (()->)) ->

      if @_loaded 
        return callback null, @source

      # template can only be loaded once
      @once "loaded", callback
      return @ if @_loading
      @_loading = true

      # first load the engine
      require ["./engines/#{@_engine}"], (engine) =>

        # then load the template source
        require ["text!#{@_baseDir}/#{@_engine}/#{@name}.#{engine.extension}"], (@source) =>  

          @_loading = false
          @_loaded  = true

          # grab the renderer
          @_renderer = engine.compile source

          # emit the source
          @emit "loaded", null, source


      @


