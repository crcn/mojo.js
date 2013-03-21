define ["mannequin", "outcome"], (mannequin, outcome) ->
  
  class BaseModel extends mannequin.Model 

    ###
    ###

    defaults: (defaults) ->
      for key of defaults
        if not @get key
          @set key, defaults[key]

    ###
    ###

    save: (callback) ->

    ###
    ###

    remove: (callback) ->

    ###
    ###

    update: (callback) ->





