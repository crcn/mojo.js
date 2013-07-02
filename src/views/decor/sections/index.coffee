ViewCollection = require "../../collection"
ChildSection   = require "./child/index"
StatesSection  = require "./list/index"
ListSection    = require "./states/index"


availableSectionClasses = [
  ChildSection,
  StatesSection,
  ListSection
]

class SectionDecorator  

  ###
  ###

  constructor: (@view, @sectionOptions) ->
    @init()

  ###
  ###

  init: () ->
    @_sections = @source = new ViewCollection()
    @view.set "sections", @

    for sectionName of @sectionOptions
      @_addSection sectionName, @sectionOptions[sectionName]

  ###
  ###

  load    : (next) -> @_sections.load next
  render  : (next) -> @_sections.render next
  display : (next) -> 

    # all sections must be rendered - throw a warning otherwise
    for section in @_sections.source()
      unless section.rendered
        console.warn "view '#{@view.path()}' has no section outlet for 'sections.#{section.name}'"

    @_sections.display next

  remove  : (next) -> @_sections.remove next

  ###
  ###

  _addSection: (name, options) ->
    sectionClass = @_findSectionClass options
    return unless sectionClass

    section = new sectionClass @view, name, options

    @view.set "sections.#{name}", section


    @_sections.push section

  ###
  ###

  _findSectionClass: (options) -> 
    for sectionClass in availableSectionClasses
      return sectionClass if sectionClass.test options





  @getOptions: (view) -> view.sections


module.exports = SectionDecorator