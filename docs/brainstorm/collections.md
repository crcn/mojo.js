## Features

1. ability to bind to remote model data
2. ability to bind to another collection


## Examples

```javascript

//
var collection = new Collection();
collection.itemFactory(new ClassFactory(People));

```

## Binding

Collections can be bound to other collections. This is especially useful when data binding
a collection of views. For instance:

```javascript

var people = new Collection([
  {
    name: "Craig"
  },
  {
    name: "John"
  }
]);

var PeopleView = ItemView.extend({
  template: templates.get("person")
});

var peopleListView = new ContainerView();
people.bindTo(peopleListView.children.itemFactory(PeopleView));

```

## API