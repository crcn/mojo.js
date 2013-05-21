### [Views](./views)

Pretty self explanatory.

### [Router](./router)

TODO

### [Mediator](./mediator)

Controls any global commands you'd like to invoke. This is basically like an in-app API, allowing a more decoupled, 
scalable architecture. A few good use-cases:

- Confirmation dialogs, alerts, or modals.
- Redirecting to another part of the single page app.
- invoking any business logic.
- any form of communication throughout the application



#### Features

- pre/post hooks

```coffeescript
mediator.on
    
  # initializes the main application
  "initApp": (next) ->
    main = new Application()
    main.attach($("#application"))
    next()
    
  # pre hook into init app for login
  "pre initApp": (next) -> mediator.execute "login", next
  
  # logs the user in
  "login": (next) ->
    return next() if loggedIn() 
    loginView = new LoginView()
    loginView.attach($("#application"))
```


### [Adapters](./adapters)

Adapters for backbone.js, and other MVC frameworks to make refactoring easier.
