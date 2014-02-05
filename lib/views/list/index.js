var protoclass = require("protoclass"),
bindable       = require("bindable"),
type           = require("type-component"),
factories      = require("factories"),
janitor        = require("janitorjs"),
BaseView       = require("../base"),
_              = require("underscore"),
runlater       = require("runlater").global,
poolparty      = require("poolparty"),
idGenerator    = require("../../utils/idGenerator");



function ListView (data, application) {
  ListView.parent.call(this, data, application);
}

/**
 */

function onOptionChange (onRef) {
  var binding, selfFn, self = this;
  return selfFn = function (value) {

    if (binding) {
      binding.dispose();
      binding = undefined;
    }

    if (typeof value === "string") {
      binding = self.bind(value, onRef).now();
    } else {
      onRef(value);
    }
  };
} 

/**
 */

protoclass(BaseView, ListView, {

  /**
   */

  chunk: 10,

  /**
   */

  delay: 0,

  /**
   * make sure decorations don't get activated for this view
   */

  _decorated: true,

  /**
   */

  __isList: true,

  /**
   */

  define: ["filter", "sort", "map", "length", "modelViewFactory", "modelViewClass", "viewClass", "source"],

  /**
   */

  initialize: function (data) {
    ListView.__super__.initialize.call(this, data);

    this._insertQueue = [];

    // the views of this list
    // _views is deprecated
    this._views = this.children = new bindable.Collection();

    this._views.bind("length", { target: this, to: "length" }).now();


    // TODO - need to check for model view factory here
    this._modelViewFactory = factories.factory.create(this.modelViewFactory || this.modelViewClass || this.viewClass);

    this._onFilterChange  = _.bind(this._onFilterChange, this);
    this._onSourceChange  = _.bind(this._onSourceChange, this);
    this._onSortChange    = _.bind(this._onSortChange, this);
    this._onInsertModel   = _.bind(this._onInsertModel, this);
    this._onReplaceModels = _.bind(this._onReplaceModels, this);
    this._onResetModels   = _.bind(this._onResetModels, this);
    this._onRemoveModel   = _.bind(this._onRemoveModel, this);
    this._onMapChange     = _.bind(this._onMapChange, this);
    this._insertNow       = _.bind(this._insertNow, this);
  },

  /**
   */

  _render: function () {
    ListView.__super__._render.call(this);

    // running in test mode, or in node? cannot have any delay.
    if (!process.browser || this.application.fake) {
      this.delay = false;
    }

    if (this._bindingJanitor) {
      this._bindingJanitor.dispose();
    }

    this._bindingJanitor = janitor();

    this._bindingJanitor.
      add(this.bind("sort", onOptionChange.call(this, this._onSortChange)).now()).
      add(this.bind("map", onOptionChange.call(this, this._onMapChange)).now()).
      add(this.bind("filter", onOptionChange.call(this, this._onFilterChange)).now()).
      add(this.bind("source", onOptionChange.call(this, this._onSourceChange)).now());
  },

  /**
   */

  _onSourceChange: function (source) {

    var start = Date.now();

    if (source === this._source) return;

    if (this._sjanitor) this._sjanitor.dispose();
    this._insertQueue = [];


    // is it an array? convert into a bindable collection
    if (type(source) === "array") {
      source = new bindable.Collection(source);
    }

    this._source = source;

    var j = this._sjanitor = janitor();

    // TODO - bottleneck - need to dispose items without calling section.removeAll()
    // for children
    this._removeAllViews();


    if (!source) return;

    // listen to the source for any changes
    j.
      add(source.on("insert", this._onInsertModel)).
      add(source.on("remove", this._onRemoveModel)).
      add(source.on("reset", this._onResetModels)).
      add(source.on("replace", this._onReplaceModels));

    // insert all the items in the source collection
    this._onResetModels(source.source());
  },

  /**
   */

  _onMapChange: function (map) {
    this._map = map;
  },

  /**
   */

  _removeAllViews: function () {
    this.section.removeAll();
    for(var i = this._views.length; i--;) {
      this._views.at(i).dispose();
    }

    // remove all the views
    this._views.source([]);
  },

  /**
   */

  _onResetModels: function (newModels, oldModels) {
    this._removeAllViews();
    this._insertModels(newModels);
  },

  /**
   */

  _insertModels: function (models) {
    var modelsToInsert = [];


    for (var i = 0, n = models.length; i < n; i++) {

      var model = models[i];

      if(this._map) {
        model = this._map(model);
      }

      this._sjanitor.add(this._watchModelChanges(model));

      if (this._filter && !this._filter(model, this)) {
        continue;
      }
      modelsToInsert.push(model);

      // uneccessary overhead calling .get()
      if (!model.__context._cid) {
        model.set("_cid", idGenerator());
      }

      var self = this;

      if (this.delay) {
        this._insertLater(model);
      }
    }

    if (!this.delay) {
      this._insertNow(modelsToInsert, true);
    }
  },

  /**
   */

  _removeModels: function (models) {
    var self = this;
    models.forEach(function (model) {
      self._onRemoveModel(model);
    }) 
  },

  /**
   */

  _onReplaceModels: function (newModels, oldModels) {
    this._removeModels(oldModels);
    this._insertModels(newModels);
  },

  /**
   */

  _onInsertModel: function (model, index) {
    this._insertModels([model]);
  },  

  /**
   */

  _insertLater: function (model) {

    // might happen on filter
    if(~this._insertQueue.indexOf(model)) {
      return;
    }

    this._insertQueue.push(model);
    if (this._runLater) return;

    var self = this

    function tick () {

      // synchronously add these models
      var models = self._insertQueue.splice(0, self.chunk);

      // no more items? stop the timer
      if (!models.length || !self._runLater) {
        self._runLater = false;
        return;
      }

      self._insertNow(models, false);
      self._resort();

      runlater(function () {
        self.application.animate({ update: tick });
      });
    }

    this._runLater = true;

    this.application.animate({ update: tick });
  },

  /**
   */

  remove: function () {
    ListView.__super__.remove.call(this);
    if (this._runLater) this._runLater = false;
    if (this._sjanitor) this._sjanitor.dispose();
    this._source = undefined;
    this._bbound
    this._views.source([]);
    this._insertQueue = [];
  },


  /**
   */

  _insertNow: function (models, resort) {

    var view, model, views = [], frags = [];

    this._inserting = models;

    for (var i = 0, n = models.length; i < n; i++) {
      model = models[i];

      if(~this._searchViewIndexById(model.__context._cid)) continue;

      // create the view
      view = this._modelViewFactory.create({
        model        : model,
        parent       : this,
        application  : this.application
      });


      views.push(view);
      frags.push(view.render());
    }

    this._inserting = [];


    if (!frags.length) {
      return;
    }


    this._views.splice.apply(this._views, [this._views.length, 0].concat(views));
    this.section.append(this.application.nodeFactory.createFragment(frags));


    if(resort) this._resort();
  },

  /**
   */

  _searchViewIndexById: function (_id) {
    var src = this._views.source();
    for (var i = src.length; i--;) {
      if(src[i].__context.model.__context._cid == _id) return i;
    }
    return -1;
  },

  /**
   */

  _watchModelChanges: function (model) {
    var self = this;
    if (!model.on) return;
    return model.on("change", function () {
      if (!self._inserting || !~self._inserting.indexOf(model))
        self._refilter([model]);
    });
  },

  /**
   */

  _onRemoveModel: function (model, index, viewIndex) {

    var i;

    // remove the item that has not been added to the DOM yet
    if (~(i = this._insertQueue.indexOf(model))) {
      this._insertQueue.splice(i, 1);
    }

    if (viewIndex === undefined) {
      viewIndex = this._searchViewIndexById(model.__context._cid);
    }

    if (!~viewIndex) {
      return;
    }


    var view = this._views.at(viewIndex);
    view.dispose();
    this._views.splice(viewIndex, 1);
  },

  /**
   */

  _onSortChange: function (sort) {
    this._sort = sort;
    this._resort();
  },

  /**
   */

  _resort: function () {
    if (!this._sort) return;

    var frag = this._views.source().sort(this._sort).map(function (view) {
      return view.section.remove();
    });

    this.section.append(this.application.nodeFactory.createFragment(frag));
  },


  /**
   */

  _onFilterChange: function (filter) {
    this._filter = filter;

    if (this._source && filter) {
      this._refilter(this._source.source());
    }
  },

  /**
   */

  _refilter: function (models) {


    if (!this._filter) return;


    var i, model, useModel, modelIndex;

    var insertModels = [];

    for (i = models.length; i--;) {
      model       = models[i];
      useModel    = !!this._filter(model, this);
      modelIndex  = this._searchViewIndexById(model.__context._cid);

      if (useModel === !!~modelIndex) {
        continue;
      }

      if (useModel) {
        insertModels.push(model);
      } else {
        this._onRemoveModel(model, undefined, modelIndex);
      }
    }

    if (insertModels.length)
      this._insertModels(insertModels);
  }



});


module.exports = ListView;