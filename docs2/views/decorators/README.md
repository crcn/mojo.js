## Templates

#### Js Example

```coffeescript
class ModalView extends mojo.View
  message: "Hello world!"
  template: template.fromString "
    <strong>{{view.message}}</strong>
  "

```

## Lists


#### Properties

- `[sectionName]` - name of the section.
  - `modelViewClass` - class to instantiate for each item in the source collection.
  - `source` - the source collection. This can be a `string`, or reference to a [collection](../../data-binding/collections).
  - `transform` - `function` which transforms the `source` item
  - `filter` - filters out items from the source collection


#### Js Example

```coffeescript
class PersonView extends mojo.View
  template: template.fromString "
    hello {{model.name}}. You're over 21! <br />
  "

class PeopleView extends mojo.View
  
  # the template for the people view - this holds the list of friends
  # provided below
  template: template.fromString "
    List if {{model.name}}'s friends: 

    {{{section.friends}}}
  "

  # creates a list of friends using the person view
  list: 
    friends: 
      itemViewClass : PersonView
      source        : "model.friends"
      filter        : (person) -> person.age > 21

```

## Children

#### Js Example

```coffeescript
class ModalView extends mojo.View

  
```

## States

## Bindings

## Events

## Attributes

## Transition

## Drag & Drop

## Custom