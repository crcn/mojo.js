events = require "events"

class Collection

  ###
  ###

  constructor: () ->
    @_droppables = {}
    @_current    = {}

  ###
  ###

  add: (name, droppable) ->
    if not @_droppables[name]
      @_droppables[name] = []

    @_droppables[name].push droppable

  ###
  ###

  remove: (name, droppable) ->
    return if not @_droppables[name]
    droppables = @_droppables[name]
    i = droppables.indexOf(droppable)
    return if not ~i
    droppables.splice(i, 1)

    # garbage collect
    if not droppables.length
      delete @_droppables[name]

  ###
  ###

  drop: (name, event) ->
    @drag name, event
    if @_current[name]
      @_current[name].emit "dragdrop", event.view
      delete @_current[name]

  ###
  ###

  drag: (name, event) ->
    return if not droppables = @_droppables[name]

    mx = event.mouse.x
    my = event.mouse.y


    for droppable, i in droppables
      del = $ droppable.view.section.getChildNodes().filter (el) -> el.nodeType is 1
      offset = del.offset()
      continue if not offset

      delx = offset.left
      dely = offset.top
      delw = del.width()
      delh = del.height()


      if (mx > delx) and (mx < delx + delw) and (my > dely) and (my < dely + delh)
        if @_current[name] isnt droppable.view
          @_current[name] = droppable.view
          droppable.view.emit "dragenter", event.view
        break
      else if @_current[name] is droppable.view
        @_current[name].emit "dragexit", event.view
        delete @_current[name]


module.exports = new Collection()
