## [Docs](./docs)

Inspired by [jquery](http://jquery.com/), [backbone](http://backbonejs.org/), and [ember](http://emberjs.com/)

## Render a Mojo view in Backbone

You might do this if your current site is written in Backbone and you don't want to switch to Mojo all at once.

```coffeescript
define ["app2/views/teacherScopeDropdown/index"], (TeacherScopeDropdownView) ->
    
SomeView = Backbone.View.extend
    
  initialize: () ->
    teacherScopeDropdown = new TeacherScopeDropdownView()
    teacherScopeDropdown.attach( $("#teacherScoper") )
```


## Create a new Mojo view
It's a lot like making a Backbone view

```coffeescript
define ["mojo"], (mojo) ->
      
  class SweetMojoView extends mojo.View
  
    ###
     called immediately after .attach() is called, and before any
     asynchronous loading functions are called - such as templates, and sections.
    ###
    
    _onLoad: () ->
      super() # super is used in mojo.View - make sure to call it!
      console.log "mojo is cool"
      
    ###
     called after the view has loaded, including all the templates
    ###
    
    _onLoaded: () ->
      super()
     
    ###
     called just before the view is attached to the DOM. This is where
     data-bindings are wired up.
    ###
    
    _onRender: () ->
      super() 
    
    ###
     called after the view has rendered completely. At this point, it's 
     ready to be attached to the DOM
    ###
    
    _onRendered: () ->
      super()
      
    
    ### 
     called just before the view is added to the DOM. This is where decorators
     such as transitions get fired.
    ###
    
    _onDisplay: () ->
      super()
     
    ###
     called after the view is added, to the dom, and all decorators have finished, such
     as transitions.
    ###
    
    _onDisplayed: () ->
      super()
     
    ###
     called just before the view is removed from the DOM. Also keep in mind that decorators
     such as transitions might also be triggered here.
    ###
    
    _onRemove: () ->
      super()
    
    ###
     called after the view has been completely removed from the DOM. At this point, transitions
     have also finished.
    ###
    
    _onRemoved: () ->
      super()
        

    
```



## Paperclip + Mojo.js

[Paperclip](/classdojo/paperclip.js) is the templating engine used for mojo.js. Here's how you use it:

```coffeescript

define ["mojo", "./sweetMojo.pc"], (mojo, sweetMojoTemplate) ->
    
  class SweetMojoView extends mojo.View
      
    ###
    ###
        
    paper: sweetMojoTemplate
        
```

Keep in mind that paperclip templates are compiled into javascript - they're functions, so you can mix & match your templates. For example:

```coffeescript
define ["mojo", "./sweetMojo.pc", "./sweetMojo2.pc"], (mojo, sweetMojoTemplate, sweetMojo2Template) ->
    
  class SweetMojoView extends mojo.View
      
    ###
    ###
        
    paper: (builder) =>
    
      # builder is an internal utility which builds on the paperclip template
      # don't worry about physically interacting with it - just pass it along
      # to whatever template you want to use.
      if @get("model.type") is "something"
        return sweetMojoTemplate(builder)
      else
        return sweetMojo2Template(builder)
        
```

### Events in Paperclip
Use html attribute "data-bind", like so:

```html
<a class="button" data-bind="{{ onClick: doSomething() }}">Click me!</a>
```



## Subviews (sections) with Mojo

Sections are sub-views which are used in a template file. Right now there are `lists`, and `states`. You can also
add a view class as a section in an html template. Here's a basic example demonstrating all 3 types of sections:

```coffeescript
  
# Notice how we include paperclip template and sweetMojoView
define ["mojo", "./sweetMojoView", "./containerTemplate.pc"], (mojo, SweetMojoView, containerTemplate) ->
    
  class SomeContainerView extends mojo.View
      
    ###
    ###
        
    paper: containerTemplate
        
    ###
    ###
        
    sections: 
      
      # child view
      main:  SweetMojoView
      
      # list view
      sweetMojos: 
        type: "list"
        source: [model1, model2, model3]
        modelViewClass: SweetMojoView
        
      # state view
      pages:
        type: "state"
        index: 0 # the initial index for the state
        views: [
         { class: SweetMojoView, anyPropertyYouWantBaby: "no" },
         { class: SweetMojoView }
        ]
      
      
```

Once you've specified your view sections, you'll need to define them in the view's template. The above example might
be something like:

```html
<div>
    {{ html: sections.main }} <!-- SweetMojoView is added here-->
    
    {{ html: sections.sweetMojos }} <!-- list view here -->
    
    {{ html: pages }} <!-- states view here -->
</div>
```

Keep in mind that `{{ html: content }}` tells paperclip to treat the target content as html. If you ommit `html:`, the data-bound
content will be sanitized for html entities, and all you'll see is html code.

### Children

Sectons can also be view classes. Here's an example:

```coffeescript
# assuming you have profileInfoView, and newsFeedView defined
class SidebarView extends mojo.View
    paper: sidebarTemplate
    sections:
        profile: ProfileInfoView
        newsFeed: NewsFeedView

```

In your sidebar template file:

```html
<div>
    {{ html: sections.profile }}
    {{ html: sections.newsFeed }}
</div>
```

### Lists

Here are the basic options for a list section:

- `type` (required) - the type of section - must be `list`
- `source` (required) - the source of the list 
- `modelViewClass` (required) - the view class to use 
- `modelViewFactory` - used instead of the modelViewClass. Use this if you might have different views within a list
- `filter` - filters out the source collection for items to display in the section

A basic example of a list section:

```coffeescript

define ["mojo", "./person.pc", "./people.pc"], (mojo, personTemplate, peopleTemplate) ->

    people = new bindable.Collection [
        new bindable.Object({
            name: "Joe",
            age: 18
        }),
        new bindable.Object({
            name: "John",
            age: 21
        })
    ]
    
    class PersonView extends mojo.View
        paper: personTemplate
    
    class PeopleView extends mojo.View
    
        paper: peopleTemplate
        
        sections:
            people: 
                type: "list"
                source: people
                modelViewClass: PersonView
            

```

In your `people` template, you'll need to again, specify where you want the section to go:

```html
List of people:
<ul>{{ html: sections.people }}</ul>
```

In your `person` template, you can write something like this:

```
<li>{{ model.name }} is {{ model.age }} years old</li>
```

Note that the `people` section automatically adds a `model` property to each `PersonView` created in the list. If the above
code were to be rendered in a browser, here's what you'd get:

```html
List of people:
<ul>
    <li>Joe is 18 years old</li>
    <li>John 21 years old</li>
</ul>
```

#### Filtering Lists

You can also filter lists pretty easily. Here's an example using our `people` example:

```coffeescript
class PeopleView extends mojo.View
    
    paper: peopleTemplate
        
    sections:
        people: 
            type: "list"
            source: people
            modelViewClass: PersonView
            filter: (person) -> person.get("age") > 20
```

The above example will only display people who's age is greater than 20. If we use the same model used above, the
expected HTML outcome would be:

```html
List of people:
<ul>
    <li>John 21 years old</li>
</ul>
```

Note that lists are *automatically updated* if any object within the source collection changes. So if you change
Joe's age to 25, the people list will automatically update to include Joe as a person who's older than 21.


#### using modelViewFactory

There might be some cases where a list has an object that might need a different view. Here's a basic example

```coffeescript
class RequestView extends mojo.View
    paper: requestTemplate
    
class MessageView extends mojo.View
    paper: messageTemplate
    
class DefaultView extends mojo.View
    paper: defaultTemplate
    
availableTemplates = 
    message: MessageView
    RequestView: RequestView
    default: DefaultView
    
class NotificationsView extends mojo.View
    sections:
        notifications:
            source: notificationsCollection
            modelViewFactory: (options) -> 
                viewClass = availableTemplates[options.model.get("type")] or availableTemplates.default
                new viewClass options
```

### States

- `type` - must be `states`
- `index` - the initial index to start on - this is `0` by default
- `views` - the views to use for each state
    - the only expected property here is `class`, but you can add anything you want as 
    - metadata for each state.

Combining what we know so far 'bout `children`, and `lists`, here's a realistic example of using the `states` 
section:

```coffeescript
define ["mojo", 
    "./main.pc", 
    "./tabs.pc", 
    "./tab.pc",
    "./pages.pc"], (mojo, mainTemplate, 
    tabsTemplate, tabTemplate, pagesTemplate) ->

    class PagesView extends mojo.View
    
        ###
        ###
        
        paper: pagesTemplate
        
        ###
        ###
        
        sections:
            pages: 
                type: "states"
                index: 0
                views: [
                    { class: ContactView , label: "Contact" },
                    { class: HomeView    , label: "Home"    }
                ]
                    
    class TabView extends mojo.View
        paper: tabTemplate
        
        ###
         selects the current state
        ###
        
        select: () -> @get("model").select()
                
    
    class TabsView extends mojo.View
    
        ###
        ###
        
        paper: tabsTemplate
        
        ###
        ###
        
        sections:
            pages: 
                type: "list"
                source: "states"
                modelViewClass: TabView
                
                
    class MainView extends mojo.View
    
        ###
        ###
        
        paper: mainTemplate
        
        ###
         create a binding from the pages states (source), to the tabs pages property.
        ###
        
        bindings:
            "sections.pages.source": "sections.tabs.pages"
        
        ###
        ###
        
        sections:
            tabs: TabsView
            pages: PagesView
        
```

main.pc:
```html

Current Page: {{ sections.pages.currentState.label  }}
{{ html: sections.tabs }}
{{ html: sections.pages }}
```

tab.pc:
```html
<li 
    data-bind="{{
        onClick: select()
    }}">
    {{ model.label }}
</li>
```

tabs.pc:
```html
<ul>
    {{ html: sections.pages }}
</ul>
```

pages.pc:
```html
{{ html: sections.pages }} 
```

#### States API

##### state states.currentState

the current state

##### states.next()

moves to the next state index 

##### states.prev()

moves to the previous state index

##### states.move(position = 1)

moves the states index +- the given position

##### states.select(index)

selects a state based on the index

##### states.source

stores all the state objects

##### states.index

the current state index

    
( we should be exhaustive here about what you can do with data-bind ) 



### Render Mojo properties in Paperclip

You could render a property of the model:

    <h1> {{ model.title }} </h1>
    
Or, a property of the view:
  
    <p> {{ propertyName }} </p>
    
Or even the results of a function:

    <p> {{ getParagraphText() }} </p>



### Computed Properties in Mojo Views
Use "bindings" to make computed properties

```coffeescript
bindings:
    # Compute a property called numUnviewed by iterating over the "viewed" property of notifications
    "notifications.@each.viewed": 
      "numUnviewed":
        "map": (viewed) -> 
          viewed.filter((viewed) -> not viewed).length
          
    # Compute full name - update if either firstName or lastName change
    "firstName, lastName":
      "fullName": 
        map: (firstName, lastName) -> [firstName, lastName].join(" ")
```

In a paperclip template, you reference computed properties like normal properties:
    <p> Hi, {{ fullName }}!  You have {{ numUnviewed  }} notifications </p>



### Show and Hide Paperclip elements based on Mojo view properties

Show a button based on a Mojo model property. 

    <a class="button" data-bind="{{ show:model.isShareable }}"> Share! </a>

Show an empty state based on a model function

```html
<!-- Empty state -->
<div class="no-monsters" data-bind="{{ show:monsters.length == 0 }}">
  <h1> No Monsters Yet! </h1>
</div>
    
<!-- Non-empty state -->
<div class="has-monsters" data-bind="{{ show:monsters.length > 0 }}">
  {{ html:sections.monsterList }}
</div>
```

### Displaying a list of items using "sections"

You can do some neat stuff with sections.  Por ejemplo...

    sections:
      monsterList:
        type:             "list"
        modelViewClass:   MonsterListItemView
        source:           "monsters"

Then, in your paperclip template, you could display your monster list like so:

    {{ html:sections.monsterList }}
    
*Note:  in your MosterListItemView class, "model" will automagically be set to the model that was passed in from the "source" property.



### Use a different Mojo view for each model in a collection
For instance, if we want a list of notifications, but want to use a different Mojo view to handle the logic for the different types of notifications:
```coffeescript
sections:
  notifications:
    type: "list"
    source:"notifications"
    modelViewFactory:  (options) ->
        viewClass = notificationViews[options.model.get("type")] or notificationViews.default
        new viewClass { notification: options.model }
```


### Accessing properties of Mojo views
```coffeescript
# Define a property
notifications:  notificationCollection

# access notifications property
@get("notifications")


_markAllViewed: () ->
        @get("notifications").each (notification) -> 
          notification.set "viewed", true
```


### Setting properties in Mojo views with Paperclip
Let's show how you can use a Paperclip template and Mojo view to set a property of a model.

Paperclip:
```html
<a class="button" data-bind="{{ onClick:_updateConnectionStatus() }}"> Connect! </a>
````

Mojo view
```coffeescript
_updateConnectionStatus: () =>
  @set "model.connectionStatus", "connected"
```


### Event bubbling in Mojo
Events will not bubble by default.  If an event is emitted within a child view, you'll need to explicitly bubble the event to any parent views:
```coffeescript
someEventHandler: () =>
  @bubble "eventNameToPropagate"
```


### Working with Popups in Mojo
There is a base class that handles modals in /base/modal.  
```coffeescript
define ["mojo", "./base/modal", "./happyMojoModalTemplate.pc], (mojo, modalView, happyMojoModalTemplate) ->

  class HappyMojoModal extends modalView
  
    paper: happyMojoModalTemplate
    
    # a static method to show a popup
    # Just call this and pass in a model to render the popup
    @show: (model) ->
      popup = new ShareClassesModal()
      popup.set "classroom", model
      mojo.mediator.execute("popup", popup)

```


### State Vies in Mojo (incomplete)

State views are helpful for doing things like tabs.  Let's look at howo
First, our view:

    sections:
      tabContent:
        type:             "states"
        index:            0
        views: [
          { class: FirstTabView },
          { class: SecondTabView }
