define ["../../core/templates/factory", "../../core/templates/plugins/i18n"], (TemplatesFactory, I18NTemplatePlugin) ->

    
  templates = new TemplatesFactory({ "/", engine: "handlebars", extension: "tpl.html" })
  templates.use new I18NTemplatePlugin()

  addClassWizard: templates.get("add-class-wizard")
  addClass: templates.get("add-class")
  addStudents: templates.get("add-students")
  addBehaviors: templates.get("add-behaviors")
  