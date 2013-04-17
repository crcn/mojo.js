define ["dojo-bootstrap/lib/views/base", "../core/templates", "bindable"], (View, templates, bindable) ->
  
  ###
  ###

  class PersonView extends View

    # the person template - this is html
    template: templates.helloWorld.person

    # listen when the .remove button is clicked, 
    # then remove this person
    events:
      "click .remove": "_remove"

    init: () ->
      super()

    # since this isn't a remote object - in this demo,
    # we'll emit a "removeperson" event which is listened
    # by the parent view
    _remove: () ->

      # would originaly be @data.remove()
      @emit "removePerson", @get("_id")

  ###
  ###

  class extends View

    template: templates.helloWorld.index


    events:

      # listen for when a user 
      "keyup #enter-name": (event) ->
        return if event.keyCode isnt 13
        @_addPerson $(event.target).val()
        $(event.target).val ""

      # listen for the specific removePerson event emitted by each person view
      "removePerson": "_removePerson"

    # specify a data-bound list view 
    list: 
      "#people":
        source: "people"
        itemViewClass: PersonView
        itemTagName: "div"

    # setup the people collection 
    init: () ->
      super()
      @people = new bindable.Collection()

    # called when "enter" is selected
    _addPerson: (name) ->
      @people.push { _id: name, name: name }

    # called when a personView emits a remove event
    _removePerson: (event, _id) ->
      i = @people.indexOf { _id: _id }
      @people.splice(i, 1)
