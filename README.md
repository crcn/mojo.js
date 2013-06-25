### [Docs](./docs)

Inspired by [jquery](http://jquery.com/), [backbone](http://backbonejs.org/), and [ember](http://emberjs.com/)


### Mojo In The Wild

Here's how you render a Mojo view in Backbone.  You might do this if your current site is written in Backbone and you don't want to switch to Mojo all at once.


    define ["app2/views/teacherScopeDropdown/index"], (TeacherScopeDropdownView) ->
    
      SomeView = Backbone.View.extend
    
        initialize: () ->
          teacherScopeDropdown = new TeacherScopeDropdownView()
          teacherScopeDropdown.attach( $("#teacherScoper") )


Making a new Mojo view is a lot like Backbone:

    define ["mojo"], (mojo) ->
      
      class SweetMojoView extends mojo.View
      
        ###
        ###
        
        _onLoad: () ->
          console.log "mojo is cool"


At ClassDojo, we use Mojo with Paperclip.  Let's make a view that will render a Paperclip template:

    define ["mojo", "./sweetMojo.pc"], (mojo, sweetMojoTemplate) ->
    
      class SweetMojoView extends mojo.View
      
        ###
        ###
        
        paper: sweetMojoTemplate
        
        ###
        ###
        
        _onLoad: () ->
          console.log "Now our template will be rendered"
          

Pretty nifty, eh?  But wait, how do we render our SweetMojoView from within another Mojo view?  

    define ["mojo", "./sweetMojoView", "./containerTemplate.pc"], (mojo, sweetMojoView, containerTemplate) ->
    
      class SomeContainerView extends mojo.View
      
        ###
        ###
        
        paper: containerTemplate
        
        ###
        ###
        
        sections: 
          main:  sweetMojoView
          
And in our paperclip file "containerTemplate.pc", we have:

    {{ html:sections.main }}
    
Now, SomeContainerView will render SweetMojoView!

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
