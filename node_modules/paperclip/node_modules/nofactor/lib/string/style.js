var protoclass = require("protoclass");

function Style (element) {
  this._element = element;
}

protoclass(Style, {

  /**
   */

  _hasStyle: false,


  /**
   */


  setProperty: function(key, value) {

    var newValue = value === "" || value == void 0 ? void 0 : value;

    if (this[key] === newValue) return;

    this[key] = value;

    this._element._triggerChange();
  },

  /**
   */


  setProperties: function(properties) {
    for (var key in properties) {
      this.setProperty(key, properties[key]);
    }
  },

  /**
   */

  reset: function (styles) {

    var styleParts = styles.split(/;\s*/),
    hasChanged     = false;

    for (var i = 0, n = styleParts.length; i < n; i++) {
      var sp = styleParts[i].split(/:\s*/),
      key    = sp[0],
      value  = sp[1];

      if (value == void 0 || value == "") {
        continue;
      }

      hasChanged = hasChanged || this[key] === value;

      this[key] = value;
    }

    if (hasChanged) this._element._triggerChange();
  },

  /**
   */

  toString: function () {
    var buffer = "", styles = this.getStyles();

    for (var key in styles) {
      buffer += key + ":" + styles[key] + ";"
    }

    return buffer;
  },

  /**
   */

  hasStyles: function () {
    if(this._hasStyle) return true;

    for (var key in this) {
      if (key.substr(0, 1) !== "_" && this[key] != undefined && this.constructor.prototype[key] == undefined) {
        return this._hasStyle = true;
      }
    }

    return false;
  },

  /**
   */

  getStyles: function () {
    var styles = {};
    for (var key in this) {
      var k = this[key];
      if (key.substr(0, 1) !== "_" && k !== "" && this[key] != void 0 && this.constructor.prototype[key] == undefined) {
        styles[key] = this[key];
      }
    }
    return styles;
  }
});

module.exports = Style;
