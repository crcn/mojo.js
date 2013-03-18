###
this library is used over async.js since it doesn't use setImmediate, which causes a delay. Don't want that for rendering views
###

define () ->
  

  ###
  ###

  async = 

    ###
     Runs all items at the same time
    ###

    forEach: (items, each, next) -> async.eachLimit items, -1, each, next

    ###
     Runs items sequentially 
    ###

    eachSeries: (items, each, next) -> async.eachLimit items, 1, each, next

    ###
     Allows for any number of items to be run in parallel
    ###

    eachLimit: (items, limit, each, next) ->

      numRunning = 0
      currentIndex = 0
      called = false
      err = null
      finished = false


      finish = () ->


        # return if already finished, or there are no more running items
        return if finished or (numRunning and not err)
        finished = true
        next err

      nextItem = () ->

        # finish if we're at the end
        return finish() if (currentIndex >= items.length) or err

        # increment the number of running items
        numRunning++
        item = items[currentIndex++]


        each item, (e) ->
          err = e
          numRunning--
          return nextItem()

        # can we have an unlimited number of parallel processes, or is the num running less than the max allowed?
        if !~limit or numRunning < limit

          # then 
          nextItem()


      nextItem()



  
  async