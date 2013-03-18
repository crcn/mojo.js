define ["./base", "rivets"], (BaseDecorator, rivets) ->



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

  BindingsDecorator.test = (view) ->
    return view.has("bindings")

  BindingsDecorator