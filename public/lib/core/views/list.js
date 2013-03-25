// Generated by CoffeeScript 1.4.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["require", "./base", "bindable", "underscore", "async", "../collections/index"], function(require, BaseView, bindable, _, async, Collection) {
    var ContainerView;
    return ContainerView = (function(_super) {

      __extends(ContainerView, _super);

      function ContainerView() {
        return ContainerView.__super__.constructor.apply(this, arguments);
      }

      /*
      */


      ContainerView.prototype.childrenElement = ".children";

      /*
      */


      ContainerView.prototype.childElement = "div";

      /*
      */


      ContainerView.prototype.init = function() {
        var childrenSource, sourceSource;
        ContainerView.__super__.init.call(this);
        childrenSource = this.get("children");
        sourceSource = this.get("source");
        this.set("children", void 0);
        this.set("source", void 0);
        this.children = this._createChildren();
        this.children.reset(childrenSource);
        this.source = this._createSource();
        return this.source.reset(sourceSource);
      };

      /*
      */


      ContainerView.prototype._childElement = function() {
        if (this.get("childrenElement")) {
          return this.$(this.get("childrenElement"));
        } else {
          return this.element;
        }
      };

      /*
      */


      ContainerView.prototype._createSource = function() {
        return new Collection();
      };

      /*
      */


      ContainerView.prototype._createChildren = function() {
        return new Collection();
      };

      return ContainerView;

    })(BaseView);
  });

}).call(this);
