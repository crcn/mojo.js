define ["disposable"],  (disposable) ->
  
  class Glue

    ###
    ###

    constructor: (@from, @fromProperty, @to, @toProperty) ->
      @_disposable = disposable.create()
      @_disposable.add(from.bind(fromProperty, @_onFromChange))

    ###
    ###

    bothWays: () ->
      return if @_gluedBothWays
      @_gluedBothWays = true
      @_disposable.add(to.bind(toProperty, @_onToChange))
      @


    ###
    ###

    _onFromChange: (value) =>
      if @to.get(@toProperty) isnt value
        @to.set @toProperty, value

    ###
    ###


    _onToChange: (value) ->
      if @from.get(@fromProperty) isnt value
        @from.set @fromProperty, value


    ###
    ###

    dispose: () ->
      @_disposable.dispose()






