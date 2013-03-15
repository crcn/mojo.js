define ["./base", "underscore", "jquery-transit", "jquery"], (BaseViewDecorator, _, transit, $) ->
  
  class TransitionDecorator extends BaseViewDecorator


    ###
    ###

    setup: (callback) -> 
      enter = @view.get("transition.enter")
      return callback if not enter
      @transition enter, callback
    

    ###
    ###


    teardown: (callback)  -> 
      exit = @view.get("transition.exit")
      return callback if not exit
      @transition exit, callback


    ###
    ###

    transition: (transition, callback) ->
      element = @element()

      if transition.from
        element.css transition.from

      element.transit transition.to or transition, callback



    ###
    ###

    element: () -> 
      selector = @view.get("transition.selector") or @view.get("transition.element") 
      return if selector then @view.element.find(selector) else view.element





  TransitionDecorator.test = (view) ->
    return view.has("transition")

  TransitionDecorator