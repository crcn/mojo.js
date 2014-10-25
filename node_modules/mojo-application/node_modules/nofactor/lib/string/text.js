var Node = require("./node"),
he      = require("he");



function Text (value, encode) {
  this.replaceText(value, encode);
}

Node.extend(Text, {

  /**
   */

  nodeType: 3,

  /**
   */

  getInnerHTML: function () {
    return this.nodeValue;
  },

  /**
   */

  cloneNode: function () {
     var clone = new Text(this.nodeValue);
    clone._buffer = this._buffer;
    return clone;
  },

  /**
   */

  replaceText: function (value, encode) {
    this.nodeValue = encode ? he.encode(String(value)) : value;
    this._triggerChange();
  }
});

module.exports = Text;