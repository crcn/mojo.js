var protoclass = require("protoclass"),
bindable       = require("bindable"),
type           = require("type-component"),
factories      = require("factories"),
hoist          = require("hoist"),
janitor        = require("janitorjs"),
BaseView       = require("../base"),
_              = require("underscore");



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
      binding = self.bind(value).to(onRef).now();
    } else {
      onRef(value);
    }
  }
} 

/**
 */

protoclass(BaseView, ListView, {

  /**
   * make sure decorations don't get activated for this view
   */

  _decorated: true,

  /**
   */

  __isList: true,

  /**
   */

  define: ["filter", "sort", "map", "length", "modelViewFactory", "modelViewClass", "viewClass"],

  /**
   */

  initialize: function (data) {
    ListView.__super__.initialize.call(this, data);

    // the views of this list
    this._views = new bindable.Collection();

    // TODO - need to check for model view factory here
    this._modelViewFactory = factories.factory.create(this.modelViewFactory || this.modelViewClass || this.viewClass);

    this._onFilterChange = _.bind(this._onFilterChange, this);
    this._onSourceChange = _.bind(this._onSourceChange, this);
    this._onSortChange   = _.bind(this._onSortChange, this);
    this._onInsertModel  = _.bind(this._onInsertModel, this);
    this._onRemoveModel  = _.bind(this._onRemoveModel, this);
    this._onMapChange    = _.bind(this._onMapChange, this);
  },

  /**
   */

  _render: function () {
    ListView.__super__._render.call(this);

    if (this._rjanitor) this._rjanitor.dispose();

    this._rjanitor = janitor();

    this._rjanitor.
      add(this.bind("sort").to(onOptionChange.call(this, this._onSortChange)).now()).
      add(this.bind("filter").to(onOptionChange.call(this, this._onFilterChange)).now()).
      add(this.bind("map").to(onOptionChange.call(this, this._onMapChange)).now()).
      add(this.bind("source").to(onOptionChange.call(this, this._onSourceChange)).now());
  },

  /**
   */

  _onSourceChange: function (source) {


    // is it an array? convert into a bindable collection
    if (type(source) === "array") {
      source = new bindable.Collection(source);
    }

    this._source = source;

    if (this._sjanitor) this._sjanitor.dispose();

    var j = this._sjanitor = janitor();

    for(var i = this._views.length; i--;) {
      this._views.at(i).dispose();
    }

    // remove all the views
    this._views.source([]);

    // listen to the source for any changes
    j.add(source.on("insert", this._onInsertModel)).add(source.on("remove", this._onRemoveModel));

    // insert all the items in the source collection
    source.source().forEach(this._onInsertModel);
  },

  /**
   */

  _onMapChange: function (map) {
    this._map = map;
  },

  /**
   */


  _onInsertModel: function (model, index) {

    if(this._map) {
      model = this._map(model);
    }

    this._sjanitor.add(this._watchModelChanges(model));

    if (this._filter && !this._filter(model, this)) {
      return;
    }

    if (!model.get("_id")) {
      model.set("_id", Date.now() + "." + Math.round(Math.random() * 999999));
    }

    // create the view
    view = this._modelViewFactory.create({
      model        : model,
      parent       : this
    });

    // add to the collection for a reference point
    this._views.push(view);

    // add to this section
    this.section.append(view.render());

    this._resort();
  },  


  /**
   */

  _watchModelChanges: function (model) {
    var self = this;
    return model.on("change", function () {
      self._refilter([model]);
    });
  },

  /**
   */

  _onRemoveModel: function (model, index, viewIndex) {

    if (viewIndex === undefined) {
      viewIndex = this._views.indexOf({ _id: model.get("_id") });
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
      return view.section.toFragment();
    });

    this.section.append(this.application.nodeFactory.createFragment(frag));
  },


  /**
   */

  _onFilterChange: function (filter) {
    this._filter = filter;

    if (this._source) {
      this._refilter(this._source.source());
    }
  },

  /**
   */

  _refilter: function (models) {

    if (!this._filter) return;


    var i, model, useModel, modelIndex;

    for (i = models.length; i--;) {
      model       = models[i];
      useModel    = !!this._filter(model, this);
      modelIndex  = this._views.indexOf({ _id: model.get("_id") });

      if (useModel === !!~modelIndex) {
        continue;
      }

      if (useModel) {
        this._onInsertModel(model);
      } else {
        this._onRemoveModel(model, undefined, modelIndex);
      }
    }

  }



});


module.exports = ListView;