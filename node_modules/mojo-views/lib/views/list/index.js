var BaseView = require("../base"),
bindable     = require("bindable"),
factories    = require("factories"),
_            = require("underscore"),
janitor      = require("janitorjs");

/**
 */

var _i = 0;

function generateCID () {
  return "cid" + (++_i);
}

/**
 */

function getOpListener (listener) {

  var self = this;

  var oldValue, currentValue, propertyBinding;

  var update = wrapInAnimation.call(this, function () {
    listener.call(self, currentValue, oldValue);
  });

  return { 
    to: function trigger (property) {
      var value;

      if (propertyBinding) propertyBinding.dispose();

      if (typeof property === "string") {
        value = self.get(property);
        propertyBinding = self.bind(property, function () {
          trigger(property);
        });
      } else {
        value = property;
      }

      oldValue     = currentValue;
      currentValue = value;

      update();
    }
  }
}

/**
 */

function wrapInAnimation (listener) {
  var self = this;
  return function () {
    var args = Array.prototype.slice.call(arguments);
    if (self.visible) {
      self.application.animate({ 
        update: function () {
          listener.apply(self, args);
        }
      });
    } else {
      listener.apply(self, args);
    }
  }
}

/**
 */

function ListView () {
  BaseView.apply(this, arguments);
  this._modelViewMap = {};
}

/**
 */

BaseView.extend(ListView, {

  /**
   */

  willRender: function () {

    if (this.children) return;

    this._sourceListeners = janitor();
    this._modelListeners  = janitor();
    this._insertModels = [];
    this._removeModels = [];
    this.children = new bindable.Collection();
    this.bind("modelViewClass", getOpListener.call(this, this._onModelViewFactoryChange)).now();
    this.bind("modelViewFactory", getOpListener.call(this, this._onModelViewFactoryChange)).now();
    this.bind("filter", getOpListener.call(this, this._onFilterChange)).now();
    this.bind("sort", getOpListener.call(this, this._onSortChange)).now();
    this.bind("source", getOpListener.call(this, this._onSourceChange)).now();
  },
  /**
   */

  _onSourceChange: function (newSource, oldSource) {
    this._removeAllChildren();
    this._sourceListeners.dispose();
    this._modelListeners.dispose();

    if (newSource && !newSource.__isBindableCollection) {
      newSource = new bindable.Collection(newSource);
    }

    this._source = newSource;
    if (newSource) {
      this._sourceListeners.add(newSource.on("update", wrapInAnimation.call(this, this._onSourceUpdate)));
      this._onSourceUpdate({ insert: newSource.source });
    }
  },

  /**
   */

  _watchModels: function (models) {
    var self = this, updating = false;


    function onModelChange () {
      if (updating) return;
      updating = true;
      self.application.animate({
        update: function () {
          if (!self.visible) return;
          updating = false;
          self._onFilterChange(self._filter, true);
        }
      });
    }



    for (var i = models.length; i--;) {
      var model = models[i];
      if (model.on) {
        this._modelListeners.add(model.on("change", onModelChange));
      }
    }
  },

  /**
   */

  _rewatchModels: function () {
    this._modelListeners.dispose();
    this._watchModels(this._source.source);
  },

  /**
   */

  _onModelViewFactoryChange: function (modelViewFactory) {
    this._modelViewFactory = factories.factory.create(modelViewFactory);
    if (!this._source) return;
    this._onSourceChange(this._source);
  },

  /**
   */

  _onFilterChange: function (filter, forceSort) {
    filter = this._filter = _.bind(filter || ListView.prototype._filter, this);
    if (!this._source) return;

    var toRemove = [], toInsert = [];

    for (var i = this._source.length; i--;) {

      var model = this._source.at(i),
      child     = this._modelViewMap[model.cid],
      useModel  = filter(model);

      if (child && !useModel) {
        toRemove.push(model);
      } else if (useModel && !child) {
        toInsert.unshift(model);
      }
    }

    if (toRemove.length) this._removeChildren(toRemove);
    if (toInsert.length || forceSort) this._addChildren(toInsert || []);
  },

  /**
   */

  _onSortChange: function (sort) {
    this._sort = sort;
    if (!this._source) return;

    var self = this;

    var children = this.children.source.sort(sort ? function (av, bv) {
      return sort.call(self, av.model, bv.model);
    } : function (av, bv) {
      return av.modelIndex > bv.modelIndex ? 1 : -1;
    });

    // update index
    for (var i = children.length; i--;) {
      children[i].set("index", i);
    }

    var prevChild;

    for (var i = 0, n = children.length; i < n; i++) {
      var child = children[i];

      // only want to render the non visible children
      if (child.visible) {

        var afterNode;

        if (child.previousSibling !== prevChild) {

          if (!prevChild) {
            afterNode = this.section.start;
          } else {
            afterNode = prevChild.section.end;
          }

          var childNodes = child.section.getChildNodes();

          for (var j = 0, n2 = childNodes.length; j < n2; j++) {
            var childNode = childNodes[j];
            afterNode.parentNode.insertBefore(childNode, afterNode.nextSibling);
            afterNode = childNode;
          }
        }

      } else {
        if (!prevChild) {
          this.section.prepend(child.render());
        } else {
          prevChild.section.end.parentNode.insertBefore(child.render(), prevChild.section.end.nextSibling);
        }
      }


      child.previousSibling = prevChild;
      if (prevChild) prevChild.nextSibling = child;
      prevChild = child;
    }

    this.emit("resort");
  },

  /**
   */

  _onSourceUpdate: function (sourceChanges) {

    this._insertModels = this._insertModels.concat(sourceChanges.insert || []);
    this._removeModels = this._removeModels.concat(sourceChanges.remove || []);

    if (this._syncingModels) return;
    var self = this;
    this.application.animate({
      update: function () {
        self._syncingModels = false;
        self._syncModels();
      }
    })
  },

  /**
   */

  _syncModels: function () {

    if (!this._source) return;
    
    var insert = this._insertModels,
    remove     = this._removeModels;

    this._insertModels = [];
    this._removeModels = [];

    if (insert.length) {
      this._watchModels(insert);
      this._addChildren(insert.filter(this._filter));
    }

    if (remove.length) {
      this._rewatchModels();
      this._removeChildren(remove);
    }
  },

  /**
   */

  _removeAllChildren: function () {
    this._modelViewMap = {};
    this.section.removeAll();

    var oldChildren = this.children.source;

    // TODO - use async each series and runlater
    for (var i = this.children.length; i--;) {
      this.children.at(i).dispose();
    }

    this.children.set("source", []);
  },

  /**
   */

  _removeChildren: function (models) {

    for (var i = models.length; i--;) {
      var model = models[i];
      var child = this._modelViewMap[model.cid];
      if (child) {
        this._modelViewMap[model.cid] = void 0;
        child.dispose();
        this.children.splice(this.children.indexOf(child), 1);
      }
    }
  },

  /**
   */

  _addChildren: function (models) {

    var newChildren = [], children, self = this;

    for (var i = 0, n = models.length; i < n; i++) {
      var model = models[i];

      if (!model.cid) model.cid = generateCID();

      var child = this._modelViewFactory.create({ 
        parent: self,
        model: model,
        modelIndex: this._source.indexOf(model)
      });

      self._modelViewMap[model.cid] = child;

      newChildren.push(child);
    }

    this.children.push.apply(this.children, newChildren);
    this._onSortChange(this._sort);
  },

  /**
   */

  _filter: function (model) {
    return true;
  }
});

module.exports = ListView;