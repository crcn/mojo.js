var type   = require("type-component"),
protoclass = require("protoclass"),
_ = require("underscore");


function SectionsDecorator (view, sectionOptions) {
  this.view           = view;
  this.sectionOptions = sectionOptions;
  view.sections = { __decorated: true };

  view.once("render", _.bind(this.init, this));
}

protoclass(SectionsDecorator, {

  /**
   */


  init: function () {
    for (var sectionName in this.sectionOptions) {
      this._addSection(sectionName, this._fixOptions(this.sectionOptions[sectionName]));
    }
  },

  /**
   */

  _addSection: function (name, options) {
    if (!options) return;

    var view = this._createSectionView(options);

    view.once("render", function () {
      view.decorate(options);
    });


    this.view.setChild(name, view);
  },

  /**
   */

  _fixOptions: function (options) {

    if (!options) {
      throw new Error("'sections' is invalid for view '"+this.view.path+"'");
    }

    if (!options.type) {
      options = { type: options };
    }

    return options;
  },

  /**
   */

  _createSectionView: function (options) {
    var t;
    if ((t = type(options.type)) === "object") {
      return options.type;
    } else if (t === "function") {
      return new options.type(options);
    } else if (t === "string") {
      return this.view.application.createView(options.type, options);
    } else {
      throw new Error("cannot create section for type '" + t + "'");
    }
  }

});

SectionsDecorator.priority = "init";
SectionsDecorator.getOptions = function (view) {
  if (view.sections && !view.sections.__decorated) {
    return view.sections;
  }
}
SectionsDecorator.decorate = function (view, options) {
  return new SectionsDecorator(view, options);
}

module.exports = SectionsDecorator;