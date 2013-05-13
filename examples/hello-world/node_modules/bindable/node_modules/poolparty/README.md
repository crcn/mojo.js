### Object Pooling & Recycling


### Motiviation

- The reduce the overhead of instantiating many objects which have a short lifecycle.
  - see `bindable.js`



First create an object that you want to add to the pool party:

```coffeescript
class BasicView extends EventEmitter
  
  ###
  ###

  reset: (@options) ->


```

Next, setup the pool party:

```coffeescript
var BasicView = require "./basicView"
var objectPool = require("poolparty")({

  max: 50,
  keepAliveTimeout: 1000 * 10

  # the function that creates the basic views
  create: (options) ->
    view = new BasicView()
    view.reset options

  # the function that resets each recycled view
  recycle: (view, options) ->
    view.reset options
});


#create a 
var basicView = objectPool.create({ name: "craig" });

#or explicitly add the object back in the object pool
objectPool.add(basicView);
```


### API

#### pool poolparty(options)

- `max` - the max number of objects allowed in a pool
- `min` - minimum number of items to use in the pool
- `keepAliveTimeout` - the number of MS before destroying a stale object
- `factory` - the function which creates a pool object
- `recycle` - called whenever an object is recycled


### pool.size()

returns the size of the pool

### pool.drip()

removes one item from the pool

### pool.drain()

removes all items from the pool except the min

### object pool.add(item)

Adds an object to the pool

### object pool.create(options)

creates, or uses a recycled object


### object.dispose()

disposes the object, and adds it back to the object pool



