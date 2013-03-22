## General guidlines when creating UI components with dojo-bootstrap

### File Structure

**SUPER** rough - this will change as stuff gets implemented.

-  `app/` - the javascript application room
  - `core/` - the core library. Everything gets tied-in here.
    - `modelLocator.js` - ALL business logic / templates / models / API should created & be tied here.
    - `models/` - models *specific* to the model locator
      - `templates.js` - ALL the templates should be defined here
    - `business/` - business logic
      - `api/` - API logic
  - `routes/` - route mapping for the URI
  - `views/` - 
    - `core/` - core views that can be re-used
    - `pages/` - views specific to each page
      - `pageX/` - specific page view
        - `pageView.js` - 


### Templates

1. ALL templates should be specified in `app/core/templates.js`
  - do not use the template factory outside of core templates
2. Each template should be written in a file


### Views

1. Views must NEVER have business logic in them.
2. A view can only manipulate model objects. When a view is finished, it should emit `complete` with the constructed model.
3. Children should be specified in the `children` property of each view.
  - this is important so that each view can be properly torn down.


### Models

1. Models must NEVER have business logic in them.
2. Models should have a schema so they can be validated.

