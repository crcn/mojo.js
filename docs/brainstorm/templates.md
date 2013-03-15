### TODO

1. `get(templateName)` should honor template paths.



Dojo templates are abstracted from the engine so the application is not tightly coupled to any particular
rendering engine. It's also a *little* strict in the sense that it expects templates to be in a particular directory. This directory however can be modified. See below:

```javascript

var templates = new TemplatesFactory({ engine: "handlebars", "/my/templates/dir" });


var testTemplate = templates.get("test"); //loaded /my/templates/handlebars/test.hb

testTemplate.render({ name: "craig" }, function(err, content) {
  console.log(content); // hello craig!
});

testTemplate.load(function(err, content) {
  console.log(content); // hello {{name}}!
});

```

It might be wise to place all templates in a single templates module. Like so:

in app/templates.js

```javascript

define ["templates/factory.js"], (TemplateFactory) ->

  var templates = new TemplateFactory({ engine: "handlebars" });

  
  return {
    homePage: templates.get("homePage"),
    titleBar: templates.get("titleBar")
  }

```


## API


### TemplateFactory(options)

Creates a new template factory
  
- `options` 
  - `engine` - the engine to use. `handlebars` is only supported for now.
  - `directory` - the root directory for the templates. This is `/templates` by default.

#### template .get(name, options)

returns a template object

- `name` - the name of the template. This should be in `/[templatPath]/[engine]/[name].[engine-extension]`.
- `options`
  - `engine` - overrides the global template engine
  - `directory` - overrides the root directory

#### template.load(callback)

Loads the template. Note that once the template is loaded, it cannot be re-loaded.


#### template.render(options, callback)

Renders a template


  

