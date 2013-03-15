define ["./base"], (BaseViewDecorator) ->
  
  class TransitionDecorator extends BaseViewDecorator


    ###
    ###

    setup: (callback) -> callback()
    

    ###
    ###


    teardown: (callback)  -> callback()





  TransitionDecorator.test = (view) ->
    return view.has("transition")

  TransitionDecorator