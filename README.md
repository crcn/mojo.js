### [Docs](./docs)

Inspired by [jquery](http://jquery.com/), [backbone](http://backbonejs.org/), 
[angular](http://angularjs.org/), [derby](http://derbyjs.com/), Adobe Flex, [knockout](http://knockoutjs.com/),
and [ember](http://emberjs.com/).

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
    ###
    
    _onLoad: () ->
      console.log "mojo is cool"
```



### Use Paperclip templates with Mojo

```coffeescript

define ["mojo", "./sweetMojo.pc"], (mojo, sweetMojoTemplate) ->
    
  class SweetMojoView extends mojo.View
      
    ###
    ###
        
    paper: sweetMojoTemplate
        
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
    
    
    
### Really nice templating

Let's make a nice empty state for when there is no data to display yet.  This is easy to do with Paperclip:

    <!-- Empty state -->
    <div data-bind="{{ show:monsters.length==0 }}">
      You don't have any monsters right now!
    </div>

    <!-- Non-empty state -->
    <div data-bind="{{ show:monsters.length > 0 }}">
      {{ html:sections.monsterList }}
    </div>


Make a button trigger an event.  

Paperclip:

    <a class="button" data-bind="{{ onClick:_makeItHot() }}">Make it hot!</a>

Mojo View:

    _makeItHot: () ->
      console.log "Make it hot button got clicked"
      
To render a property of the view in your template:

    <h1> {{ model.title }} </h1>
      

### Really easy state views

(Not sure about this right now)

State views are helpful for doing things like tabs.  Let's look at howo
First, our view:

    sections:
      tabContent:
        type:             "states"
        index:            0
        views: [
          { class: FirstTabView },
          { class: SecondTabView }
