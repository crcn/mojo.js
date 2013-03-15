###
 creates a tree that's bindable

 tree = new EventTree();

 tree.on(function() {
  
 });

 tree.on("name.first", function() {
    
 });

 tree.emit("name", { first: "craig" });

###

define () ->

  class EventTree


    ###
    ###

    constructor: ()  ->
      @_listeners = []
      @_leafs = {}


    ###
    ###


    emit: (key, value) ->
      leaf = @_findLeaf(key)
      leaf._emit(key)

    ###
    ###

    _emit: (value) ->
      for listener in @_listeners
        listener(value)

      for leafName of @_leafs
        @_leafs[leafName]._emit value



    ###
    ###

    on: (key, value) ->

      if arguments.length is 1
        value = key
        key   = undefined




      @_findLeaf(key)._addListener value


    ###
    ###

    once: (key, value) ->
      disposable = @on key, () ->
        disposable.dispose()
        value.apply this, arguments


    ###
    ###

    _findLeaf: (key) -> @_findLeafs(key).pop()


    ###
    ###

    _findLeafs: (key) ->
      keyParts = if key then key.split "." else []
      current = @
      leafs = [current]

      while keyParts.length
        leafs.push current = current._leaf keyParts.shift()

      return leafs


    ###
    ###

    _leaf: (name) -> 
      @_leafs[name] or (@_leafs[name] = new EventTree())


    ###
    ###

    _addListener: (value) -> 
      @_listeners.push value

      {
        dispose: () =>
          i = @_listeners.indexOf value
          return if not ~i
          @_listeners.splice i, 1
      }



  EventTree






