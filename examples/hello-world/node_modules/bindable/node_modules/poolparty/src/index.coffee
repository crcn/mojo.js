class PoolParty 

  ###
  ###

  constructor: (options = {}) ->

    @max          = options.max or 50
    @min          = options.min or 0
    @staleTimeout = options.staleTimeout or 1000
    @factory      = options.factory or options.create
    @recycle      = options.recycle

    @_pool = []
    @_size = 0

  ###
  ###

  size: () -> @_size


  ###
  ###

  drain: () ->
    for i in [0...@_size - @min]
      @drip()

  ###
  ###

  drip: () =>
    @_dripping = false
    if not @_size
      return

    @_size--
    @_pool.shift()

    @_timeoutDrip()




  ###
  ###

  create: (options) ->

    if @_size
      @_size--
      item = @_pool.shift()
      @recycle item, options
      return item

    item = @factory options
    item.__pool = @
    item


  ###
  ###

  add: (object) ->

    # cannot add an object not of the same pool
    if object.__pool isnt @
      return @

    # make sure the object doesn't already exist in the pool, and the pool isn't overfilling
    if !~@_pool.indexOf(object) and @_size < @max
      @_size++
      @_pool.push object
      @_timeoutDrip()
    

    @

  ###
  ###

  _timeoutDrip: () ->
    return if @_dripping
    @_dripping = true
    setTimeout @drip, @staleTimeout





module.exports = (options) -> new PoolParty options