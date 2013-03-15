// Generated by CoffeeScript 1.4.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./base", "../models/base"], function(BaseView, BaseModel) {
    var ItemView;
    return ItemView = (function(_super) {

      __extends(ItemView, _super);

      function ItemView() {
        return ItemView.__super__.constructor.apply(this, arguments);
      }

      ItemView.prototype.init = function(options) {
        var _this = this;
        return options.on("update", function() {
          return _this.rerender();
        });
      };

      return ItemView;

    })(BaseView);
  });

}).call(this);
