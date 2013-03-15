define ["require", "jquery", "events"], (require, $, events) ->
  
  class Template extends events.EventEmitter

    ###
    ###

    constructor: (@factory, @name) ->
      @_engine = @factory.engine()


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


      @once "loaded", callback
      return @ if @_loading
      @_loading = true


      require ["./engines/#{@_engine}"], (engine) =>
        require ["text!/templates/#{@_engine}/#{@name}.#{engine.extension}"], (@source) =>
          @_renderer = engine.compile source
          @emit "loaded", null, source


      @


