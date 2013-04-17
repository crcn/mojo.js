define ["dojo-bootstrap/lib/templates/factory"], (Templates) ->

  templates = new Templates( { directory: "/tpl", extension: "tpl.html" })
  
  helloWorld:
    index: templates.get("helloWorld/index")
    person: templates.get("helloWorld/person")


