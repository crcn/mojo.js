var type   = require("type-component"),
protoclass = require("protoclass"),
_          = require("underscore");


function ChildrenDecorator (view, childOptions) {

  this.view           = view;
  this.childOptions   = childOptions;
  view.sections       = view.children = { __decorated: true };
  
  // need to initialize before bindings
  this.init();
}

protoclass(ChildrenDecorator, {

  /**
   */


  init: function () {
    for (var sectionName in this.childOptions) {
      this._addChild(sectionName, this._fixOptions(this.childOptions[sectionName]));
    }
  },

  /**
   */

  _addChild: function (name, options) {
    if (!options) return;
    
    var view = this._createChildView(options);

    view.once("decorate", function () {
      view.decorate(options);
    });

    view.setProperties({
      name: name,
      parent: this.view
    });
  },

  /**
   */

  _fixOptions: function (options) {

    if (!options) {
      throw new Error("'children' is invalid for view '"+this.view.path+"'");
    }

    if (!options.type) {
      options = { type: options };
    }

    return options;
  },

  /**
   */

  _createChildView: function (options) {
    var t;

    if ((t = type(options.type)) === "object") {
      if (options.type.__isView) {
        return options.type;
      } else {
        return this.view.application.views.create("base", options.type);
      }
    } else if (t === "function") {
      return new options.type(options, this.view.application);
    } else if (t === "string") {
      return this.view.application.views.create(options.type, options);
    } else {
      throw new Error("cannot create child for type '" + t + "'");
    }
  }

});

ChildrenDecorator.priority = "init";
ChildrenDecorator.getOptions = function (view) {

  // DEPRECATED - use children prop instead
  if (view.sections && !view.sections.__decorated) {
    return view.sections;
  }
  
  if (view.children && !view.children.__decorated) {
    return view.children;
  }
}

ChildrenDecorator.decorate = function (view, options) {
  return new ChildrenDecorator(view, options);
}

module.exports = ChildrenDecorator;
