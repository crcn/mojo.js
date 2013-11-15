views       = require "./views"
Application = require "./application"

module.exports = 
  
  # to extend onto
  View        : views.BaseView

  # to create
  Application : Application

if typeof window isnt "undefined"
  window.mojo = module.exports