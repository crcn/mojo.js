dref   = require "dref"
utils  = require "./utils"
verify = require("verify")()
async  = require "async"
toarray = require "toarray"
isa  = require "isa"

###
###

class PropertyDefinition
  
  ###
  ###

  constructor: (@schema, key, options) ->

    keyParts = key.split(" ")
    @key = keyParts.pop()
    @scope = keyParts.pop() or "private"


    @options = @_fixDefnition options

    # make sure the definition is OK
    @_validateDefinition()

    # make the validators for the data type
    @_createValidators()


  ###
  ###

  test: (target, callback) ->

    return callback() if @options.$validate is false

    originalValue = dref.get(target, @key)

    v = testV = originalValue ? @_default target

    if testV and testV.source
      testV = testV.source()

    if ((testV is undefined or testV is null) or (typeof testV is "string" and not testV.length)) and @options.$required
        return callback new Error "\"#{@key}\" must be present"


    async.forEach @_testers, ((tester, next) ->
      tester testV, next
    ), (err) =>

      if err 
        return callback new Error @options.message or "\"#{@key}\" is invalid"

      if v isnt originalValue
        dref.set target, @key, v

      callback()

  ###
  ###

  schemaRef: () -> 
    return null if not @options.$ref
    @schema.dictionary().getSchema(@options.$ref)


  ###
  ###

  _fixDefnition: (definition) ->


    if typeof definition is "string" and utils.firstKey(definition).substr(0, 1) isnt "$"
      return {
        $type: definition
      }
    else if isa.array definition
      def = @_fixDefnition definition[0]
      def.$multi = true
      def.$default = () -> []
      return def
    else 
      return definition


  ###
  ###

  _validateDefinition: () ->

    if not @options.$type and not @options.$ref
      throw new Error "definition type must exist for #{@key}"


  ###
  ###

  _createValidators: () ->  

    testers = []

    #if @options.$multi
    #  testers.push verify.tester().is (item) ->
    #    console.log item



    if @options.$ref
      testers.push @_multi (item, next) =>
        @schemaRef().test item, next
    else
    if @options.$type
      testers.push @_multi @_generateTypeTester()

    @_testers = testers


  ###
  ###

  _generateTypeTester: () ->

    return @options.$test if @options.$test

    tester = verify.tester().is(@options.$type)

    # checks for stuff like { $type: "string", $is: /regexp/ }
    for key of @options
      k = key.substr(1)
      if !!tester[k]
        tester[k].apply tester, toarray @options[key]

    tester


  ###
  ###

  _multi: (tester) ->
    tester = @_tester tester
    (value, next) ->
      async.forEach toarray(value), ((value, next) ->
        tester value, next
      ), next

  ###
  ###

  _default: (target) ->
    return @options.$default if not @options.$default
    return @options.$default.call(target) if typeof @options.$default is "function"
    return @options.$default


  ###
  ###

  _getSchema: (value) ->
    return @schema.dictionary()?.getSchema value

  ###
  ###

  _tester: (target) ->

    context = @
    test    = null

    if typeof target is "function"
      test = target
    else if target.test
      test = target.test
      context = target

    (value, next) ->
      if test.length is 1
        next !test.call context, value
      else
        test.call context, value, next





###
###

module.exports = PropertyDefinition
