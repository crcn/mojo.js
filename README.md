### [Docs](./docs)

Inspired by [jquery](http://jquery.com/), [backbone](http://backbonejs.org/), and [ember](http://emberjs.com/)


### Render a Mojo view in Backbone

You might do this if your current site is written in Backbone and you don't want to switch to Mojo all at once.

```coffeescript
define ["app2/views/teacherScopeDropdown/index"], (TeacherScopeDropdownView) ->
    
SomeView = Backbone.View.extend
    
  initialize: () ->
    teacherScopeDropdown = new TeacherScopeDropdownView()
    teacherScopeDropdown.attach( $("#teacherScoper") )
```


### Create a new Mojo view
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



### Use Paperclip templates with Mojo

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



### Subviews with Mojo

```coffeescript
  
# Notice how we include paperclip template and sweetMojoView
define ["mojo", "./sweetMojoView", "./containerTemplate.pc"], (mojo, sweetMojoView, containerTemplate) ->
    
  class SomeContainerView extends mojo.View
      
    ###
    ###
        
    paper: containerTemplate
        
    ###
    ###
        
    sections: 
      main:  sweetMojoView
```
    
    
    
### Render a "section" in a Paperclip template
Our paperclip file "containerTemplate.pc" from the above code just needs one line:

    {{ html:sections.main }}
    
    
    
### You can write HTML in Paperclip

    <div class="main-container">
      {{ html:sections.main }}
    </div>



### Events in Paperclip
Use html attribute "data-bind", like so:

    <a class="button" data-bind="{{ onClick: doSomething() }}">Click me!</a>
    
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
