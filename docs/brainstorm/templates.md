


```javascript

var template = templates.get("test");

template.render({ name: "craig" }, function(err, content) {
  console.log(content); // hello craig!
});

template.load(function(err, content) {
  console.log(content); // hello {{name}}!
})