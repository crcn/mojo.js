# inject is a [CoffeeScript](http://coffeescript.org) module used to modify the
# class inheritance chain dynamically. It sucessfully sets up the prototype
# chain and object properties.

_ = require 'underscore'

# Make `child` inherit from `parent`
inherits = (child, parent) ->
  proto = child::
  child extends parent
  child::[x] = proto[x] for own x of proto when x not of child::
  child

# Inject `injected` directly before `leaf` in `leaf`s prototype chain, overriding
# `injected`s ancestor chain with `leaf`s ancestor chain first.
inject = (child, parents...) ->
    extend = (leaf, parent) ->
        if leaf.__super__
            parent = inherits parent, leaf.__super__.constructor
        inherits leaf, parent
    _.reduceRight parents, extend, child


module.exports = inject
module.exports.inject = inject
module.exports.inherits = inherits
