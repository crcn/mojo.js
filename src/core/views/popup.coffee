define [], () ->

  
  class Popup

    ###
    ###



  Popup.show = (clazz) ->
    view = new clazz()
    view.attach $("body").append("<div></div>").children().last()
    view

  Popup
