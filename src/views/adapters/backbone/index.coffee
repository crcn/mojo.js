define ["../base/index", "./view", 
"./collection", "./model"], (BaseAdapter, BackboneWrapperView, 
  BackboneWrapperCollection, BackboneWrapperModel) ->
  
  class BackboneAdapter extends BaseAdapter

    ###
    ###

    getModel: (value) ->  
      return false if not value.idAttribute
      new BackboneWrapperModel value

    ###
    ###

    getCollection: (value) ->
      return false if not value._byId or not value.models
      new BackboneWrapperCollection value

    ###
    ###

    getViewClass: (clazz) ->
      proto = clazz.prototype
      return false if not proto.tagName or not proto.$
      class extends BackboneWrapperView
        viewClass: clazz