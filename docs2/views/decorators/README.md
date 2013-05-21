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

class HeaderView extends mojo.View
  # stuff here...

class BodyView extends mojo.View
  # stuff here...

class FooterView extends mojo.View
  # stuff here...


class ModalView extends mojo.View

  # template which specified where the children go
  template: template.fromString "
    {{{section.header}}}
    {{{section.body}}}
    {{{section.footer}}}
  "

  # child views - 
  children:
    header : HeaderView
    body   : BodyView
    footer : FooterView
  
```

## States

#### Js Example
  
```coffeescript

class SlideView extends mojo.View


class SlideshowView extends mojo.View
    
  template: template.fromString "
    {{{section.slides}}}
  "

  states: 
    slides: [
      SlideView,
      SlideView
    ]

```

## Bindings

#### Js Example

```coffeescript
class PeopleView extends mojo.View
  
  list:
    friends:
      modelViewClass: PersonView
      source: "friends"

  bindings:
    "model.friends": "friends"
```

## Events

#### Js Example

```coffeescript
class LoginView extends mojo.View

  template: template.fromString "
    <input type='text' placeholder='username'></input>
    <input type='submit' id='submit' value='login'></input>
  "

  events:
    "#submit": "_login"


  _login: (event) ->  
    # do something here!
```

## Transition

#### Js Example

```coffeescript
class HeaderView extends mojo.View
class BodyView extends mojo.View
class FooterView extends mojo.View

class ModelView extends mojo.View
  
  children:
    header: HeaderView
    body: BodyView
    footer: FooterView

  transition: {
    enter: {
      from: { opacity: 0 },
      to: { opacity: 0.25 }
    },
    exit: {
      to: { opacity: 0  }
    }
  }
```


## Drag & Drop

#### Js Example

```coffeescript

# this is the view which is draggable
class MonsterView extends mojo.View
  template: draggableTemplate
  draggable: "monster"

# view which is droppable
class StudentView extends mojo.View
  droppable: "monster"
  events: 
    "dragenter": (event, view) -> 
      # do stuff...
    "dragexit": (event, view) ->  
      # do stuff...
    "dragdrop": (event, view) ->
      @set "model.photo", view.get("model.photo")

# create a list of draggable monsters
class MonstersView extends mojo.View
  template: monsterListTemplate
  list:
    monsters:
      modelViewClass: MonsterView
      source: "monsters"

# create a list of students where the monsters can
# be dropped onto
class StudentsView extends mojo.View
  template: studentsView
  list:
    students:
      modelViewClass StudentView
      source: "students"


# bring it all together
class EditStudentsView extends mojo.View
  template: editStudentsTemplate
  children:
    monsters: MonstersView
    students: StudentsView

```