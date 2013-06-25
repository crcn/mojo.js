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

### More on Sections

You can do some neat stuff with sections.  Por ejemplo...

    sections:
      type:             list
      modelViewClass:   MonsterListItemView
      source:           "monsters"
