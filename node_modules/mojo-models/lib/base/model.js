var bindable = require("bindable"),
_            = require("lodash"),
Application           = require("mojo-application");

function BaseModel (properties, application) {

  // set the context of the model to itself
  bindable.Object.call(this);

  this.application = application || Application.main;

  // set the data from the constructor
  this.setProperties(this._deserializedData = properties || {});

  // watch when data changes
  this.bind("data", _.bind(this._onData, this));
  if (this.data) this._onData(this.data);

  // decorate this model
  this.application.models.decorate(this);
}

module.exports = bindable.Object.extend(BaseModel, {

  /**
   */

  deserialize: function (data) {
    return data;
  },

  /**
   */

  serialize: function () {

    var serialized = {}, data = this._deserializedData;

    for (var key in data) {
      var v = this[key];
      serialized[key] = v;
    }

    return serialized;
  },

  /**
   */

  toJSON: function () {
    return this.serialize();
  },

  /**
   */

  _onData: function (data) {
    
    if (!data) return;

    // deserialize data, and set to this model

    var data = this.deserialize(data);


    if (typeof data === "object") {
      this._deserializedData = data;
      this.setProperties(data);
    } else {
      this.set("value", data);
    }
  }
});