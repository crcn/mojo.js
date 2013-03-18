define ["../../core/templates/factory"], (TemplatesFactory) ->
    
  templates = new TemplatesFactory({ "/", engine: "none", extension: "tpl.html" })

  addClassWizard: templates.get("add-class-wizard")
  addClass: templates.get("add-class")
  addStudents: templates.get("add-students")
  addBehaviors: templates.get("add-behaviors")
  