define ["bindable"], (Bindable) ->
  
  class Model extends Bindable

    ###
    ###

    defaults: (defaults) ->
      for key of defaults
        if not @get key
          @set key, defaults[key]


    ###
    ###

    validate: (callback) ->


    ###
    ###

    save: (callback) ->



