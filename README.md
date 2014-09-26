Mojo.js is a customizable, modular JavaScript framework inspired by Node.js and Backbone.js. The framework is entirely modular - everything is broken out into smaller, more manageable libraries that allow you to cherry-pick exactly what features you want to use for your application. These libraries include the application, models, views, template engine, router. These libraries were designed to work well with one-another, but not depend on each other. This means that you can even use your own models, views, template engine, or router, and Mojo.js will play nicely with them.

Mojo.js was designed with the Strangler Pattern in mind. If you already have a pre-existing application, you can easily build Mojo on-top of it without a full, application re-write. Meaning you can slowly ease into it without worrying about the all-or-nothing approach associated with most JavaScript frameworks.

This library comes bundles with: 
[mojo-models](/mojo-js/mojo-models), [views](/mojo-js/mojo-views), [mojo-paperclip](/mojo-js/paperclip.js),
[mojo-router](/mojo-js/mojo-router.js), [mojo-bootstrap](/mojo-js/mojo-bootstrap), [zepto](http://zeptojs.com/), and [inject.js](http://www.injectjs.com/).

## Browser API


```html
<html>
  <head>
    <script type="text/javascript" data-main="./entry.js" src="//cdnjs.cloudflare.com/ajax/libs/mojo/0.9.0/mojo.min.js" />
  </head>
  <body>
  </body>
</html>
```

### 
