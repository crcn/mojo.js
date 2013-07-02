hooks = require "hooks"
type = require "type-component"
crema = require "crema"
_ = require "underscore"


class Mediator

  ###
  ###

  constructor: () ->
    @commands = {}
    _.extend @commands, hooks


  ###
  ###

  on: (name, callback) ->

    if type(name) is "object"
      commands = name
      for name of commands
        @on name, commands[name]
      return

    @_register name, callback

  ###
  ###

  execute: () ->
    args = Array.prototype.slice.call arguments
    name = args.shift()
    return if not @commands[name]
    @commands[name].apply @commands, args

  ###
  ###

  _register: (routes, callback) ->

    # parse the routes
    routes = crema(routes)

    for route in routes

      if not @commands[name = route.path.value.substr(1)]
        @commands[name] = () ->

      if not route.type
        route.type = "hook"

      hooks[route.type].call @commands, name, callback


module.exports = Mediator

