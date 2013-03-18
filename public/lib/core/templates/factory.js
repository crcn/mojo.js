// Generated by CoffeeScript 1.4.0
(function() {

  define(["./template", "asyngleton", "underscore"], function(Template, asyngleton, _) {
    var TemplateFactory;
    return TemplateFactory = (function() {
      /*
      */

      function TemplateFactory(options) {
        if (options == null) {
          options = {};
        }
        this._engine = options.engine || "handlebars";
        this._directory = options.directory || "/templates";
        this._extension = options.extension;
        this._templates = {};
      }

      /*
           Sets the target template engine
      */


      TemplateFactory.prototype.engine = function(value) {
        if (!arguments.length) {
          return this._engine;
        }
        return this._engine = value;
      };

      /*
      */


      TemplateFactory.prototype.directory = function(value) {
        if (!arguments.length) {
          return this._directory;
        }
        return this._directroy = value;
      };

      /*
      */


      TemplateFactory.prototype.fromSource = function(source, options) {
        options.source = source;
        return this.get(source, options);
      };

      /*
      */


      TemplateFactory.prototype.get = function(name, options) {
        if (options == null) {
          options = {};
        }
        _.defaults(options, {
          engine: this._engine,
          directory: this._directory,
          extension: this._extension,
          name: name
        });
        return this._templates[name] || (this._templates[name] = new Template(options));
      };

      return TemplateFactory;

    })();
  });

}).call(this);
