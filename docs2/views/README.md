
## API

### .attach(selector[,callback])

Attaches the view to the DOM.

- `selector` - jquery selector - this is where the view is attached to.
- `callback` (optional) - called when the view has been completely loaded.

```coffeescript
class BasicView extends mojo.View

bv = new BasicView()
bv.attach($("#container"))
```

### .remove(callback)

Removes the view from the DOM.

- `callback` (optional) - called when the view has been completely removed.


### .get(property)

Returns a view property. 

```coffeescript
class BasicView extends mojo.View
  message: "hello world!"
  init: () ->
    super()
    console.log @get("message")
``

Note that if a view property doesn't exist, `.get()` will return the parent view property instead. For example:

```coffeescript
class ChildView extends mojo.View
  init: () ->
    super()
    console.log @get("message") # hello world!

class BasicView extends mojo.View
  message: "hello world!"
  children: 
    someChild: ChildView
```

### .set(property, value)

Sets a value to the view.

### Binding .bind(property) 

Binds two properties together. Checkout [bindable.js](https://github.com/classdojo/bindable.js) for more docs.

```coffeescript
view = new BasicView()
view.bind("message").to (value) ->
  console.log value # hello world! then blah!
view.set "message", "blah!"
```


### .$(selector)

finds elements based on the given selector, starting at the view's assigned element.

### .emit(event, args...)

emits an event

### .bubble(event, args...)

bubbles up an event to the root view.


### [Decorators](./decorators)

### [Templates](./templates)

### [Sections](./sections)


## Models