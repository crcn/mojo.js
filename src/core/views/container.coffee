define ["./base", "../collections/concrete", "underscore"], (BaseView, Collection, _) ->

  class ContainerView extends BaseView

    ###
    ###

    constructor: (@options = {}) ->

      _.defaults(options, {
        childrenElement: ".children"
      })  

      @children = new Collection()

      @children.on "updated", @_onChildrenUpdated
      @children.source(@options.children or [])

    ###
    ###

    _onChildrenUpdated: (event) =>

