


class VanillaEngine extends Base

  constructor: () ->
    super "tpl"

  ###
  ###

  compile: (source) ->

    return {
      render: (options, callback) ->
        callback null, source
    }

module.exports = VanillaEngine