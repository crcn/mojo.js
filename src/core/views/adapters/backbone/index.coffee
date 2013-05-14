define ["../base/index"], (BaseAdapter) ->
  
  class BackboneAdapter extends BaseAdapter

    ###
    ###

    getModel: (value) ->  
      return false if not value.idAttribute
      console.log "MODEL"

    ###
    ###

    getCollection: (value) ->

    ###
    ###

    getView: (value) ->
      