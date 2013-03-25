// Generated by CoffeeScript 1.6.2
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["./base", "bindable", "step"], function(BaseView, bindable, step) {
    var StateView, _ref;

    return StateView = (function(_super) {
      __extends(StateView, _super);

      function StateView() {
        this._onStatesChange = __bind(this._onStatesChange, this);
        this._onCurrentStateChange = __bind(this._onCurrentStateChange, this);
        this._onIndexChange = __bind(this._onIndexChange, this);
        this.prevState = __bind(this.prevState, this);
        this.nextState = __bind(this.nextState, this);
        this._onReady = __bind(this._onReady, this);        _ref = StateView.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      /*
      */


      StateView.prototype.currentIndex = 0;

      /*
      */


      StateView.prototype.init = function(options) {
        var states;

        StateView.__super__.init.call(this, options);
        states = new bindable.Collection();
        states.transform().map(function(state) {
          if (typeof state === "object") {
            return state;
          }
          return new state();
        });
        states.reset(this.get("states") || []);
        states.on("updated", this._onStatesChange);
        states.bind().to(this.loadables);
        return this.states = states;
      };

      /*
      */


      StateView.prototype._onReady = function() {
        StateView.__super__._onReady.call(this);
        return this.bind("currentIndex", this._onIndexChange);
      };

      /*
      */


      StateView.prototype.nextState = function() {
        var ni;

        ni = this.get("currentIndex") + 1;
        if (ni > this.states.length() - 1) {
          return this.emit("noMoreStates");
        }
        return this.set("currentIndex", Math.min(this.get("currentIndex") + 1, this.states.length() - 1));
      };

      /*
      */


      StateView.prototype.prevState = function() {
        return this.set("currentIndex", Math.max(this.get("currentIndex") - 1, 0));
      };

      /*
      */


      StateView.prototype._onIndexChange = function(index) {
        var self;

        self = this;
        if (!self.states.length() || !this.element) {
          return;
        }
        return step((function() {
          if (!self._currentView) {
            return this();
          }
          return self._currentView.remove(this);
        }), (function() {
          self._currentView = self.states.at(index);
          self.set("currentView", self._currentView);
          self._currentView.attach(self._childrenElement().append("<div />").children().last());
          return self._onCurrentStateChange();
        }));
      };

      /*
      */


      StateView.prototype._childrenElement = function() {
        var childrenElement;

        childrenElement = this.get("childrenElement");
        if (!childrenElement) {
          return this.element;
        }
        return this.$(childrenElement);
      };

      /*
      */


      StateView.prototype._onCurrentStateChange = function() {};

      /*
       if the states change then make sure the current state is synced as well
      */


      StateView.prototype._onStatesChange = function() {
        var currentView;

        currentView = this.states.getItemAt(this.get("currentIndex"));
        if (this._currentView !== currentView) {
          return this._onIndexChange(this.get("currentIndex"));
        }
      };

      return StateView;

    })(BaseView);
  });

}).call(this);
