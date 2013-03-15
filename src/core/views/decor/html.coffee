define ["./base"], (BaseDecorator) ->
  
  class HtmlDecorator extends BaseDecorator


    ###
    ###

    setup: (callback) ->
      @view.element.html @view.get "html"
      callback()


    ###
    ###

    teardown: (callback) ->
      @view.element.html ""
      callback()

  HtmlDecorator.test = (view) ->
    view.has "html"

  HtmlDecorator