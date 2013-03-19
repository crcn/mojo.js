## General guidlines when creating UI components with dojo-bootstrap

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

