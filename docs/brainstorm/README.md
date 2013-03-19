These sort of docs are generally used to help me figure out how I want to organize code. I do lots of rambling.


The idea around dojo-bootstrap stems around the early days of when I was a Flex / Flash developer. I've taken a lot of concepts from the Flex framework, along with some of the best parts (imo) from Backbone, Ember, and various other Frameworks. The goal behind this framework is to minimize the coupling by any part of application, so it remains lean even if you're only using bits and pieces of it. In that sense - it's very node.js-y. 

With that said, There are various parts of the application that I've tried to breakdown into high-level concepts:

### Collections

Collections are bindable pieces of data that are inspired by mongodb collections. Each item in a collection must have an `_id`, so that each collection can be properly synchronized with other collections. A good example of this might be synchronizing a collection of models with a collection of views. For example:

```javascript
var people = new Collection([new Person(), new Person()]);

//for each item in the view children collection, make a personView out of it.
view.children.itemFactory(PersonView);

//glue the people collection to the view children
people.glue(view.children);
```

This isn't at all a standard design pattern - it's just the nature of the framework. Any particular collection can be bound together using the "glue" method. The above example might be better written as this:

```javascript
var lv = new ListView()
lv.childViewClass = PersonView;
lv.source = new Collection([new Person(), new Person()])
```

Which is does a little better job explaining what's happening with the code. Both examples listed however do exactly the same thing.


### Bindings

### Views


#### View Decorators

### Templates

### 
