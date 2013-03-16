define ["../../core/templates/factory"], (TemplatesFactory) ->
    
  templates = new TemplatesFactory({ "/", engine: "none" })

  addClassModal: templates.get("add-class-modal", { directory: "/templatesfdsfsd/" })
  addClass: templates.get("add-class")
  addStudents: templates.get("add-students")
  addBehaviors: templates.get("add-behaviors")
  