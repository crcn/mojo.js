

_flatten = (target, path, context) ->

  for key of target
    v = target[key]
    cp = path.concat(key)
    kk = cp.join(".")

    # is there a modifier? return the entire object
    if key.substr(0, 1) is "$"
      context[path.join(".")] = target
      return

    # no value? skip it
    else if not v
      continue

    # is it an array? the type must be an array
    else if v instanceof Array
      context[kk] = v

    # is it an object
    else if typeof v is "object"

      # if the value a schema, then the type is a schema
      if exports.isSchema v
        context[kk] = v

      # otherwise continue to flatten
      else
        _flatten v, cp.concat(), context

    # a string? 
    else
      context[kk] = v


  context




exports.isSchema = (target) -> !!target and target.__isSchema
exports.flattenDefinitions = (target) -> _flatten target, [], {}
exports.firstKey = (target) ->
  for k of target 
    return k


