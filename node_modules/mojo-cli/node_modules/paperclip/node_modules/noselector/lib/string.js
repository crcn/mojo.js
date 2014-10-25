var bindable = require("bindable"),
_            = require("lodash"),
toarray      = require("toarray");

module.exports = selector;

function selector (els, parent) {

  if (!els) els = [];



  var $elements =  toarray(els).concat();


  _.extend($elements, {

    /**
     */

    parent  : parent,

    /**
     */

    name: function () {
      return this.length ? this[0].nodeName : void 0;
    },

    /**
     */

    each : function (iterator) {
      for (var i = 0, n = this.length; i < n; i++) {
        iterator.call(this[i], i, this[i]);
      }
      return this
    },

    /**
     */

    find: function (query) {
      var tester = elementTester(query),
      found = [];
      this.traverse(function (element) {
        if (tester(element)) {
          found.push(element);
        }
      });

      return selector(found);
    },

    /**
     */

    eq: function (index) {
      return selector(this[index]);
    },

    /**
     */

    filter: function (filter) {
      if (!filter) return this;
      if (typeof filter === "string") filter = elementTester(filter);
      return selector(_.filter(this, filter), this.parent);
    },

    /**
     */

    first: function () {
      return selector(this[0]);
    },

    /**
     */

    andSelf: function () {
      if (!this.parent) return this;
      return selector(_.uniq(this.concat(this.parent)), this);
    },

    /**
     */

    attr: function (name, value) {
      if (!this.length) return;
      if (arguments.length === 1) {
        return (this.length && this[0].getAttribute ? this[0].getAttribute(name) : void 0) || "";
      } else {
        this.each(function (index) {
          this.setAttribute(name, value);
        });
      }
    },

    /**
     */

    css: function (properties) {
        this.each(function () {
          this.style.setProperties(properties);
        });
    },

    /**
     */

    val: function (value) {
      if (!this.length) return this;
      if (!arguments.length) {
        return this[0].nodeValue;
      } else {
        this[0].nodeValue = value;
      }
      return this;
    },

    /**
     */

    html: function () {
      return this.length ? this[0].toString() : void 0;
    },

    /**
     */

    text: function () {
      var buffer = [];
      this.traverse(function () {
        if (this.nodeType === 3 && this.nodeValue && this.nodeValue.length) {
          buffer.push(this.nodeValue);
        }
      });
      return buffer.join(" ");
    },

    /**
     */

    traverse: function (iterator) {
      this.each(function () {
        iterator.call(this, this);
        selector(this.childNodes).traverse(iterator);
      });
    },

    /**
     */

    prop: function (name) {
      return this.attr.apply(this, arguments);
    },

    /**
     */

    bind: function (eventNames, listener) {
      var self = this;
      eventNames.split(" ").forEach(function (eventName) {
        self.each(function () {
          this._emitter.on(eventName, listener);
        })
      });
      return this;
    },

    /**
     */

    unbind: function (eventNames, listener) {
      var self = this;
      eventNames.split(" ").forEach(function (eventName) {
        self.each(function () {
          this._emitter.off(eventName, listener);
        })
      });
      return this;
    },

    /**
     */

    trigger: function (event, options) {
      if (typeof event === "string") {
        event = new Event(event, options);
      }
      this.each(function () {
        this._emitter.emit(event.name, event);
      });
      return this;
    }
  });


  ["click"].forEach(function (eventName) {
    $elements[eventName] = function (nameOrListener) {
      if (typeof nameOrListener === "function") {
        this.bind(eventName, nameOrListener);
      } else {
        this.trigger(eventName);
      }
    }
  });


  $elements.each(function () {
    this._emitter = this._emitter || new bindable.Object();
  })

  return $elements;
}

function Event (name, options) {
  this.name = name;
  _.extend(this, options || {});
}

Event.prototype.stopPropagation = function () {

}

Event.prototype.preventDefault = function () {

}


function elementTester (query) {
  if (query.substr(0, 1) === "#") return idTester(query);
  if (query.substr(0, 1) === ".") return classTester(query);
  if (query === "*") return anythingTester(query);
  if (~query.indexOf("[")) return attrTester(query);
  return nameTester(query);
}

function anythingTester(query) {
  return function () {
    return true;
  }
}

function idTester (query) {
  return function (element) {
    return selector(element).attr("id") === query.substr(1);
  }
}

function classTester (query) {
  return function (element) {
    return ~selector(element).attr("class").indexOf(query.substr(1));
  }
}

function nameTester (query) {
  return function (element) {
    return element.nodeName == String(query).toUpperCase();
  }
}

function attrTester (query) {
  var i = query.indexOf("[");
  var nodeName = query.substr(0, i);
  if (!nodeName.length) nodeName = "*";
  var nameTester = elementTester(nodeName);

  var attrInfo = query.match(/\[(.*?)(\=\'(.*?)\')?\]/);

  var attrName = attrInfo[1],
  attrValue    = attrInfo[3];

  return function (element) {
    return nameTester(element) && element.getAttribute(attrName) == attrValue;
  }
}
