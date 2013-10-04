## Mojo was created for a number of reasons:

- It was built with refactoring in mind.
  - you can use your existing codebase and incremently make new components using mojo.js
  - there are no globals - this makes it easier to encapsulate views, and use them in an existing application. This is unlike `ember`, and `angular`.
- It's unopinionated
  - There's no concept of inheritance, and all functionality is shoved in `decorators`. This concept is actually derrived from jquery plugins - where plugins can be attached to DOM elements, `decorators` are similar in the sense that they attach to one abstraction higher - the view controlling the DOM element.
  - The framework itself is broken into multiple repositories - this makes it easier to encapsulate, and re-use bits of functionality. It also helps explain parts of the framework a little better.
- There's a clear separation between design patterns.
  - mojo has absolutely NO knowledge of an API layer - everything is interfaced via bindable objects.
    - `linen.js` maps APIs to bindable objects, along with CRUD methods such as `POST`, `PUT`, `GET`, and `DELETE` to `bindable.save()`
    - This clear separation makes it easy to setup fixtures that can run on the front-end.

## Refactoring with Mojo.js

Mojo was built with refactoring in mind. At ClassDojo, it would have been impossible for us to use another framework such as angular, and ember since they have such a strict programming style. Mojo.js takes on a backbone-like approach by allowing any mojo view to be attached to a DOM element, like so:

```javascript
var someMojoView = new MojoView();
someMojoView.attach($("#element"));
```


## Wiring up Mojo.js

Mojo.js has a separate repository called `linen` which is independent from the framework itself. `linen` works by mapping schemas to bindable objects, and api routes. This level of abstraction from mojo.js allows us to build front-end components without an API - views themselves should only interface bindable objects, and collections. using fixture data for building front-end components also allows us to build tests that aren't racy. 

## Development process with mojo.js



