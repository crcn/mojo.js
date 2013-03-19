###
templates.use(i 8n)
###


define ["jquery", "underscore", "asyngleton", "events", "../utils/async"], ($, _, asyngleton, events, async) ->
    
  # TODO 
  #console.log module.config()
  
  class Translator extends events.EventEmitter

    ###
    ###

    constructor: () ->
      @options = {
        language:  navigator.language,
        directory: "/i18n"
      }
      @_translations = {}

    ###
    ###

    translate: (string) -> @t string

    ###
    ###

    t: (string) ->
      translated = @_translations[string]

      if not translated
        @emit "missingTranslation", string

      return translated or string

    ###
     Loads the translation strings
    ###

    load: asyngleton (callback) ->

      # there might be some overlap with certain languages, such as en-us, and en-gb, en
      load = [@options.language, @options.language.split("-").shift()]


      async.eachSeries load, ((lang, next) =>

        $.ajax {
          url: "#{@options.directory}/#{lang.toLowerCase()}.json", 
          type: "GET",
          dataType: "json",
          success: (content) =>
            _.extend @_translations, content
            next()
          error: () =>
            # try the next file
            next()
          callback: () ->
        }

      ), callback

  translator = new Translator()


  return {
    load: (name, req, onLoad) ->
      translator.load () ->
        onLoad translator
  }





  

