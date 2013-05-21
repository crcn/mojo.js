define [], () ->
  (max = 20) ->
    calls = 0
    (callback) ->
      args = Array.prototype.slice.call arguments
      args.shift()

      unless ++calls % max
        calls = 0
        setTimeout (() =>
          callback.apply @, args
        ), 0
      else
        callback.apply @, args
