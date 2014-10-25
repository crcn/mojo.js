Crowbar HTTP Router [![Alt ci](https://travis-ci.org/classdojo/crowbar.js.png)](https://travis-ci.org/classdojo/mojo-router)

[![Testling](https://ci.testling.com/classdojo/crowbar.js.png)](https://ci.testling.com/classdojo/crowbar.js)

Crowbar is a flexible routing system inspired by [express](http://expressjs.com/), and [director](https://github.com/flatiron/director). 

### Example

```javascript
var router = require("crowbar")();

function auth (location, next) {
  // authenticate here
}

router.param("classroom", function (location, next) {
  // load classroom
  next(null, classroom);
});  

router.add({
  enter: auth,
  "/classes/:classroom": {
    "/reports": {
      enter: function (location, next) {
        // do stuff with route
      }
    }
  }
});

router.redirect("/classes/classid/reports", function (err, location) {
  console.log(location.get("params.classroom")); // classroom model
  console.log(location.get("pathname")); // /classes/classid/reports
  console.log(location.get("url")); // same as pathname, but also includes query params
});
```

#### Entering Routes

Called when a route is entered.

```javascript
router.add({
  "/home": {
    enter: function (location, next) {
      // do stuff
      next(); // continue
    }
  }
});

router.redirect("/home", function (err, location) {

});
```

You can also specify multiple enter handlers:

```javascript
router.add({
  "/home": {
    enter: [auth, function (location, next) {
      // do stuff
      next(); // continue
    }]
  }
});
```

## API


#### Exiting Routes

Useful if you want to teardown a route before entering another.

```javascript
router.add({
  "/contact": {
    exit: function (location, next) {
      next();
    },
    enter: function (location, next) {
      next();
    }
  },
  "/home": {
    enter: function (location, next) {
      next(); // continue
    }
  }
});

router.redirect("/contact");
router.redirect("/home"); // exit handler called
```

Just like enter handlers, you can specify multiple exit handlers

#### Route States

States are properties set by the router which may modify your application state. This is used specifically in mojo.js.

```javascript
router.add({
  "/classes/:classroom": {
    states: { app: "classes" },
    "/reports": {
      states: { classes: "reports" }
    }
  }
});

router.bind("location.states", function (states) {
  // { app: "classes", classes: "reports" }
});

router.redirect("/classes/classid/reports");
```

#### Parameters

Just like express.js, you have the ability to create parameter loaders.

```javascript
router.param("classroom", function (location, next) {
  console.log("location.params.classroom"); // classid
  next(null, classroomModel);
});

router.add({
  "/classes/:classroom": {}
});

router.redirect("/classes/classid", function (err, location) {
  console.log(location.get("params.classroom")); // classroomModel
})
```

#### Naming Routes

```javascript
router.add({
  "/classes/:classroom": {
    name: "classroom"
  }
});

router.redirect("classroom", {
  params: {
    classroom: "classid"
  }
}, function (err, location) {

});
```

### listeners

Kubrick comes with an HTTP listener by default, which is loaded automatically in the browser.

#### router.redirect(pathnameOrRouteName[, options], complete)

- `pathnameOrRouteName` - pathname or route name to redirect to
- `options` - route name options
  - `query` - route query
  - `params` - route params
- `complete` - called when redirected

#### router.add(routes)

adds new routes to the router

#### router.use(plugins...)

adds plugins to the router

#### router.location

The current location of the router

```javascript
router.bind("location", function () {
  // called whenever the location changes
});
```

#### Routes router.routes

Routes property

#### routes.find(query)

Finds a route based on the query.

```javascript
router.add({
  "/home": {
    name: "homeRoute"
  }
});

console.log(router.routes.find({ pathname: "/home" })); // /home route
console.log(router.routes.find({ pathname: "homeRoutek " })); // /home route
```

#### location.query

query parameters on the location. Note that if the query changes, those changes will also be reflected in the HTTP url.

```javascript
router.bind("location", function (err, location) {
  console.log(location.get("query.hello")); // blah
  location.set("query.hello", "world"); // gets reflected in the HTTP url
});

router.redirect("/home?hello=blah");
```

#### location.params

similar to `location.query`. `location.params` are taken from the route parameters.

#### location.url

pathname + query params.

```javascript
router.bind("location", function (err, location) {
  console.log(location.get("url")); // /home?hello=blah
});

router.redirect("/home?hello=blah");
```

#### location.pathname

just the pathname of the location

#### location.equals(location)

returns TRUE of the both locations are the same

#### location.redirect(pathname, options)

redirects the location

## Mojo.js Usage

basic usage:

```javascript
var mojo = require("mojojs"),
app = new mojo.Application();
app.use(require("crowbar"));

app.router.add({
  "/home": { }
});
```
