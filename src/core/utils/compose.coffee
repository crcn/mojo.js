###
 Makes it easier to create a composite objects
###


define ["underscore"], (_) ->
  return (target, compose, methods) ->  
    for method in methods
      target[method] = _.bind(compose[method], compose)
