define ["./base", "rivets"], (BaseViewDecorator, rivets) ->



  rivets.configure({
    adapter: {
      subscribe: (obj, keypath, callback) ->
        obj.on "change:" + keypath.replace(/,/g, "."), callback

      unsubscribe: (obj, keypath, callback) ->
        obj.off "change:" + keypath.replace(/,/g, "."), callback

      read: (obj, keypath) ->
        obj.get keypath.replace(/,/g, ".")

      publish: (obj, keypath, value) ->
        obj.set keypath.replace(/,/g, "."), value
    }
  })

  
  class BindingsDecorator extends BaseViewDecorator

    ###
    ###

    setup: (callback) ->
      rivets.bind @view.element, { data: @view }
      callback()




  BindingsDecorator.test = (view) -> true

  BindingsDecorator