
Since developing Mojo, we've come up with a set of patterns, and guidlines when developing applications. These tips are guidlines, not rules, and they're constantly evolving. However, they're helpful to follow so that there's a level of consistency, and organization in the codebase.


### Only set properties on the global "models" object from commands.

Commands and models are really the only two things that are global. Commands are meant to be executed, compute a bunch of stuff, then change the application state - which may involve modifying the global `models` property. It maybe tempting to modify models elsewhere in the application such as login form. Below is an example - **don't do this**:

```javascript
var LoginView = mojo.View.extend({

  // don't do this! Makes the application
  // depend on the LoginView. 
  bindings: {
    "loginRequest.data": "application.models.user"
  },

  paper: require("./login.pc"),

  login: function () {
    var self = this;
    this.set("loginRequest", bindableCall(function (next) {
      self.mediator.execute("login", {
        email    : self.get("email"),
        password : self.get("password")
      }, next);
    }));
  }
});
```

The problem with the code above is that the application now depends on LoginView. If the user were set within a command, Then `login` could be executed anywhere within the application.


### Use proper naming conventions when defining methods.

Methods that are never called outside of a view controller should have an underscore prefix. This is to help identify which methods are public, or private. For example:

view.js:

```javascript
var HelloView = mojo.View.extend({

  /**
   */

  paper: require("./view.pc"),
  
  /**
   */

  sayHello: function () {
    console.log("hello!");
  },

  /**
   */

  _internalUseOnly: function () {

  }
});
```

view.pc:

```html
<a href="#" data-bind="{{ onClick: sayHello() }}">Hello!</a>
```

Similarly, `_internalUseOnly` should never be called outside of the view controller.

### Only make API calls within commands

Models, and view controllers should NEVER make a remote request - they should call a command that does it for them. This is more for **testability** - commands can easily be swapped out with fake commands that still make a fully functioning application. 

### Use folders to define nested components

When developing components, we usually identify the heirarchy of the entire thing, then break down the component into smaller pieces. We then create a 1-1 mapping between what we saw, and how it's broken out into files, and folders. Here's a good example:

```bash
views/
  main/
    header/
      index.js
      index.pc
    pages/
      home/
        index.js
        index.pc
      login/
      reports/
      settings/
      index.js
      index.pc
```

The above example is pretty easy to follow. At a glance you're probably able to visualize a little bit what application might actually look like. This sort of pattern makes it incredibly easy for other engineers to jump in and modify code, and it's also easy for others to implement.

### Place all re-usable views in the views/ directory

Lots of times you might want to create a component that you want to re-use in another part of your application. These should be placed in the views/ directory. For example:

```bash
views/
  main/ - main view component
  dropMenu/ - drop menu component
  avatar/ - avatar component
```


