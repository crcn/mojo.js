var bindable = require("bindable"),
_            = require("lodash"),
BaseModel    = require("./model"),
janitor      = require("janitorjs"),
Application  = require("mojo-application");

function BaseCollection (options, application) {
  if (!options) options = {};
  bindable.Collection.call(this, options.source);
  this.application = application || Application.main;
  this._modelsJanitor = janitor();
  this.setProperties(options);
  this.bind("data", _.bind(this._onData, this));
  if (this.data) this._onData(this.data);
  this.application.models.decorate(this);
  this._rewatchModels();
}

// deserialize should check for UID

module.exports = bindable.Collection.extend(BaseCollection, {

  /**
   */

  idProperty: "_id",

  /**
   */

  deserialize: function (data) {
    return {
      value: data
    };
  },

  /**
   */

  createModel: function (options) {
    options.collection = this;
    var ModelClass = BaseModel;

    if (this.modelType) {
      if (typeof this.modelType === "function") {
        ModelClass = this.modelType;
      } else {
        return this.application.models.create(this.modelType, options);
      }
    }
    return new ModelClass(options, this.application);
  },

  /**
   */

  create: function (options) {
    
    if (!options) options = {};

    options.owner = this.owner;

    var model = this._watchModel(this.createModel(options), true),
    self = this;


    if (options.waitUntilSave !== true) {
      this.push(model);
    } else {
      model.once("didSave", function () {
        if (options.waitUntilSave === true) self.push(model);
      });
    }


    return model;
  },

  /**
   */

  _onData: function (data) {
    var self = this;

    var ndata = this.deserialize(data || []),
    source    = ndata.value || ndata.source;

    if (!source) {
      ndata = {
        source: source = ndata
      };
    }

    delete ndata["source"];

    this.setProperties(ndata);


    var nsrc = source || [],
    emodels  = this.source.concat(),
    nmodels  = [],
    nmodel;

    this._modelsJanitor.dispose();


    // update existing
    for (var i = emodels.length; i--;) {
      var emodel = emodels[i];
      for (var j = nsrc.length; j--;) {
        var newValue = nsrc[j];
        if (this._compareIds(emodel, newValue)) {

          // update with emodel
          emodel.set("data", newValue);

          // remove so it doesn't get processed
          emodels.splice(i, 1);
          nsrc.splice(j, 1);
        }
      }
    }

    // remove all models that couldn't be updated
    for (var i = emodels.length; i--;) {
      var emodel = emodels[i];
      this.splice(this.indexOf(emodel), 1);
      emodel.dispose();
    }

    // insert the new models
    for (var i = 0, n = nsrc.length; i < n; i++) {
      nmodel = this.createModel({ data: nsrc[i] });
      this.push(nmodel);
      nmodels.push(nmodel);
    }

    this._rewatchModels();


    // make sure that data has already been set - if so, compare old / new length
    // and emit an update. This is important incase an exernal source adds, or removes an item
    if (this._addedDataOnce) {

      var ops = {};

      if (nmodels.length) {
        ops.insert = nmodels;
      } 

      if (emodels.length) {
        ops.remove = emodels;
      }


      if (ops.insert || ops.remove) {
        this.emit("didUpdate", ops);
      }
    }

    this._addedDataOnce = true;
  },

  /**
   */

  _watchModel: function (model, isNew) {
    var self = this;

    var listeners = janitor();

    listeners.add(model.on("didSave", function () {
      if (isNew) {
        self.emit("didUpdate", { insert: [model] });
      } else {
        self.emit("didUpdate", { save: model });
      }
    }));
    
    this._modelsJanitor.add(model.once("dispose", function () {
      var i = self.indexOf(model);

      if (model.remove != null) {
        model.once("didRemove", function () {
          self.emit("didUpdate", { remove: [model] });
        });
      }

      listeners.dispose();
      if (!~i) return;
      self.splice(i, 1);
    }));

    this._modelsJanitor.add(listeners);
    
    return model;
  },

  /**
   */

  _rewatchModels: function () {
    this._modelsJanitor.dispose();
    for (var i = this.length; i--;) {
      this._watchModel(this.at(i));
    }
  },

  /**
   */

  _compareIds: function (model, value) {
    if (typeof value === "object") {
      return model.data[this.idProperty] === value[this.idProperty];
    } else {
      return model.value === value;
    }
  },

  /**
   */
  
  toJSON: function () {
    return this.source.map(function (model) {
      return model.toJSON();
    })
  }
});