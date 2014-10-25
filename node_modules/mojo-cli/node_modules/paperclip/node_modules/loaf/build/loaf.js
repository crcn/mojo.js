;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = window.loaf = require("./index");
},{"./index":2}],2:[function(require,module,exports){
var protoclass = require("protoclass"),
nofactor       = require("nofactor");

var Section = function (nodeFactory) {

  this.nodeFactory = nodeFactory = nodeFactory || nofactor["default"];

  // create invisible markers so we know where the sections are
  this.start       = nodeFactory.createTextNode("");
  this.end         = nodeFactory.createTextNode("");
  this.visible     = true;

  var parent  = nodeFactory.createElement("div");
  parent.appendChild(this.start);
  parent.appendChild(this.end);
};


Section = protoclass(Section, {

  /**
   */

  __isLoafSection: true,

  /**
   */

  replace: function (node) {
    node.parentNode.insertBefore(this.toFragment(), node);
    node.parentNode.removeChild(node);
  },

  /**
   */


  show: function () {
    if(!this._detached) return this;
    this.append.apply(this, this._detached.getInnerChildNodes());
    this._detached = void 0;
    this.visible = true;
    return this;
  },

  /**
   */

  hide: function () {
    this._detached = this.removeAll();
    this.visible = false;
    return this;
  },

  /**
   */

  removeAll: function () {
    return this._section(this._removeAll());
  },

  /**
   */

  _removeAll: function () {

    var start = this.start,
    end       = this.end,
    current   = start.nextSibling,
    children  = [];

    while (current != end) {
      current.parentNode.removeChild(current);
      children.push(current);
      current = this.start.nextSibling;
    }

    return children;
  },

  /**
   */

  append: function () {
    this._insertAfter(Array.prototype.slice.call(arguments, 0), this.end.previousSibling);
  },

  /**
   */

  prepend: function () {
    this._insertAfter(Array.prototype.slice.call(arguments, 0), this.start);
  },

  /**
   */

  replaceChildNodes: function () {

    //remove the children - children should have a parent though
    this.removeAll();
    this.append.apply(this, arguments);
  },

  /**
   */

  toString: function () {
    var buffer = this.getChildNodes().map(function (node) {
      return node.innerHTML || (node.nodeValue || String(node));
    });
    return buffer.join("");
  },

  /**
   */

  toFragment: function () {
    return this.nodeFactory.createFragment(this.getChildNodes());
  },

  /**
   */

  dispose: function () {
    if(this._disposed) return;
    this._disposed = true;
    this._removeAll();
    this.start.parentNode.removeChild(this.start);
    this.end.parentNode.removeChild(this.end);
  },

  /**
   */

  getChildNodes: function () {
    var cn   = this.start,
    end      = this.end.nextSibling,
    children = [];

    while (cn != end) {
      children.push(cn);
      cn = cn.nextSibling;
    }

    return children;
  },

  /**
   */

  getInnerChildNodes: function () {
    var cn = this.getChildNodes();
    cn.shift();
    cn.pop()
    return cn;
  },

  /**
   */

  _insertAfter: function(newNodes, refNode) {
    if(!newNodes.length) return;

    newNodes = newNodes.map(function(node) {
      if(node.__isLoafSection) {
        return node.toFragment()
      } else {
        return node;
      }
    });

    if(newNodes.length > 1) {
      newNodes = this.nodeFactory.createFragment(newNodes);
    } else {
      newNodes = newNodes[0];
    }

    return refNode.parentNode.insertBefore(newNodes, refNode.nextSibling);
  },

  /**
   */

  _section: function (children) {
    var section = new Section(this.nodeFactory);
    section.append.apply(section, children);
    return section;
  }
});

module.exports = function (nodeFactory)  {
  return new Section(nodeFactory);
}
},{"nofactor":6,"protoclass":8}],3:[function(require,module,exports){
var protoclass = require("protoclass");

function BaseFactory () {

}

protoclass(BaseFactory, {

  /**
   */

  createElement: function (element) { },

  /**
   */

  createFragment: function () { },

  /**
   */

  createComment: function (value) { },

  /**
   */

  createTextNode: function (value) { },

  /**
   */

  parseHtml: function (content) { }
});



module.exports = BaseFactory;

},{"protoclass":8}],4:[function(require,module,exports){
var Base = require("./base");

function DomFactory () {

}


Base.extend(DomFactory, {

  /**
   */

  name: "dom",

  /**
   */

  createElement: function (name) {
    return document.createElement(name);
  },

  /**
   */

  createTextNode: function (value) {
    return document.createTextNode(value);
  },

  /**
   */

  createFragment: function (children) {

    if (!children) children = [];

    var frag = document.createDocumentFragment()

    var childrenToArray = [];

    for (var i = 0, n = children.length; i < n; i++) {
      childrenToArray.push(children[i]);
    }

    for(var j = 0, n2 = childrenToArray.length; j < n2; j++) {
      frag.appendChild(childrenToArray[j]);
    }

    return frag;
  }
});

module.exports = new DomFactory();
},{"./base":3}],5:[function(require,module,exports){
// from node-ent

var entities = {
  "<"  : "lt",
  "&"  : "amp",
  ">"  : "gt",
  "\"" : "quote"
};

module.exports = function (str) {
  str = String(str);

  return str.split("").map(function(c) {

    var e = entities[c],
    cc    = c.charCodeAt(0);

    if (e) {
      return "&" + e + ";";
    } else if (c.match(/\s/)) {
      return c;
    } else if(cc < 32 || cc > 126) {
      return "&#" + cc + ";";
    }

    return c;

  }).join("");
}
},{}],6:[function(require,module,exports){
module.exports = {
  string : require("./string"),
  dom    : require("./dom")
};

module.exports["default"] = typeof window !== "undefined" ? module.exports.dom : module.exports.string;
},{"./dom":4,"./string":7}],7:[function(require,module,exports){
var ent     = require("./ent"),
Base        = require("./base"),
protoclass  = require("protoclass");


function Node () {

}

protoclass(Node, {
  __isNode: true
});


function Container () {
  this.childNodes = [];
}

protoclass(Node, Container, {

  /**
   */

  appendChild: function (node) {

    if (node.nodeType === 11) {
      while (node.childNodes.length) {
        this.appendChild(node.childNodes[0]);
      }
      return;
    }

    this._unlink(node);
    this.childNodes.push(node);
    this._link(node);
  },

  /**
   */

  prependChild: function (node) {
    if (!this.childNodes.length) {
      this.appendChild(node);
    } else {
      this.insertBefore(node, this.childNodes[0]);
    }
  },

  /**
   */

  removeChild: function (child) {
    var i = this.childNodes.indexOf(child);

    if (!~i) return;

    this.childNodes.splice(i, 1);

    if (child.previousSibling) child.previousSibling.nextSibling = child.nextSibling;
    if (child.nextSibling)     child.nextSibling.previousSibling = child.previousSibling;

    delete child.parentNode;
    delete child.nextSibling;
    delete child.previousSibling;
  },

  /**
   */

  insertBefore: function (newElement, before) {

    if (newElement.nodeType === 11) {
      var before, node;
      for (var i = newElement.childNodes.length; i--;) {
        this.insertBefore(node = newElement.childNodes[i], before);
        before = node;
      }
    }

    this._splice(this.childNodes.indexOf(before), 0, newElement);
  },

  /**
   */

  _splice: function (index, count, node) {

    if (typeof index === "undefined") index = -1;
    if (!~index) return;

    if (node) this._unlink(node);
    
    this.childNodes.splice.apply(this.childNodes, arguments);

    if (node) this._link(node);
  },

  /**
   */

  _unlink: function (node) {
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
  },

  /**
   */

  _link: function (node) {

    if (!node.__isNode) {
      throw new Error("cannot append non-node");
    }

    node.parentNode = this;
    var i = this.childNodes.indexOf(node);

    // FFox compatible
    if (i !== 0)                         node.previousSibling = this.childNodes[i - 1];
    if (i != this.childNodes.length - 1) node.nextSibling     = this.childNodes[i + 1];

    if (node.previousSibling) node.previousSibling.nextSibling = node;
    if (node.nextSibling)     node.nextSibling.previousSibling = node;
  }
});



function Style () {

}

protoclass(Style, {

  /**
   */

  _hasStyle: false,

  /**
   */


  setProperty: function(key, value) {

    if (value === "" || value == undefined) {
      delete this[key];
      return;
    }

    this[key] = value;
  },

  /**
   */

  parse: function (styles) {
    var styleParts = styles.split(/;\s*/);

    for (var i = styleParts.length; i--;) {
      var sp = styleParts[i].split(/:\s*/);

      if (sp[i] == undefined || sp[1] == "") {
        continue;
      }

      this[sp[0]] = sp[1];
    }
  },

  /**
   */

  toString: function () {
    var buffer = [];
    for (var key in this) {
      if(this.constructor.prototype[key] !== undefined) continue;

      var v = this[key];

      if (v === "") {
        continue;
      }

      buffer.push(key + ": " + this[key]);
    }

    if(!buffer.length) return "";

    return buffer.join("; ") + ";"
  },

  /**
   */

  hasStyles: function () {
    if(this._hasStyle) return true;

    for (var key in this) {
      if (this[key] != undefined && this.constructor.prototype[key] == undefined) {
        return this._hasStyle = true;
      }
    }

    return false;
  }
});


function Element (nodeName) {
  Element.superclass.call(this);

  this.nodeName    = nodeName.toUpperCase();
  this._name       = nodeName.toLowerCase();
  this.attributes  = [];
  this._attrsByKey = {};
  this.style       = new Style();

}

protoclass(Container, Element, {

  /**
   */

  nodeType: 3,

  /**
   */

  setAttribute: function (name, value) {
    name = name.toLowerCase();

    if (name === "style") {
      return this.style.parse(value);
    }

    if (value == undefined) {
      return this.removeAttribute(name);
    }

    var abk;

    if (!(abk = this._attrsByKey[name])) {
      this.attributes.push(abk = this._attrsByKey[name] = {})
    }

    abk.name  = name;
    abk.value = value;
  },

  /**
   */

  removeAttribute: function (name) {

    for (var i = this.attributes.length; i--;) {
      var attr = this.attributes[i];
      if (attr.name == name) {
        this.attributes.splice(i, 1);
        break;
      }
    }

    delete this._attrsByKey[name];
  },

  /**
   */

  getAttribute: function (name) {
    var abk;
    if(abk = this._attrsByKey[name]) return abk.value;
  },

  /**
   */

  toString: function () {

    var buffer = ["<", this._name],
    attribs    =  [],
    attrbuff;

    for (var name in this._attrsByKey) {

      var v    = this._attrsByKey[name].value;
      attrbuff = name;

      if (name != undefined) {
        attrbuff += "=\"" + v + "\"";
      }

      attribs.push(attrbuff);
    }

    if (this.style.hasStyles()) {
      attribs.push("style=" + "\"" + this.style.toString() + "\"");
    }

    if (attribs.length) {
      buffer.push(" ", attribs.join(" "));
    }

    buffer.push(">");
    buffer.push.apply(buffer, this.childNodes);
    buffer.push("</", this._name, ">");

    return buffer.join("");
  }
});


function Text (value, encode) {

  if (encode) {
    value = ent(value);
  }

  this.value = value;
}

protoclass(Node, Text, {

  /**
   */

  nodeType: 3,

  /**
   */

  toString: function () {
    return this.value;
  }
});

function Comment () {
  Comment.superclass.apply(this, arguments);
}

protoclass(Text, Comment, {

  /**
   */

  nodeType: 8,

  /**
   */

  toString: function () {
    return "<!--" + Comment.__super__.toString.call(this) + "-->";
  }
});

function Fragment () {
  Fragment.superclass.call(this);
}

protoclass(Container, Fragment, {

  /**
   */

  nodeType: 11,

  /**
   */

  toString: function () {
    return this.childNodes.join("");
  }
});

function StringNodeFactory (context) {
  this.context = context;
}

protoclass(Base, StringNodeFactory, {

  /**
   */

  name: "string",

  /**
   */

  createElement: function (name) {
    return new Element(name);
  },

  /**
   */

  createTextNode: function (value, encode) {
    return new Text(value, encode);
  },

  /**
   */

  createComment: function (value) {
    return new Comment(value);
  },

  /**
   */

  createFragment: function (children) {
    if (!children) children = [];
    var frag = new Fragment(),
    childrenToArray = Array.prototype.slice.call(children, 0);

    for (var i = 0, n = childrenToArray.length; i < n; i++) {
      frag.appendChild(childrenToArray[i]);
    }

    return frag;
  },

  /**
   */

  parseHtml: function (buffer) {

    //this should really parse HTML, but too much overhead
    return this.createTextNode(buffer);
  }
});

module.exports = new StringNodeFactory();
},{"./base":3,"./ent":5,"protoclass":8}],8:[function(require,module,exports){
function _copy (to, from) {

  for (var i = 0, n = from.length; i < n; i++) {

    var target = from[i];

    for (var property in target) {
      to[property] = target[property];
    }
  }

  return to;
}

function structr (superclass, constructor) {

  var mixins = Array.prototype.slice.call(arguments, 2);


  if (typeof constructor !== "function") {
    if(constructor) mixins.unshift(constructor); // constructor is a mixin
    constructor   = superclass;
    superclass    = undefined;
  } else {
    mixins.unshift(superclass.prototype);
  }

  _copy(constructor.prototype, mixins);

  if (superclass) {

    // copy static properties
    _copy(constructor, superclass);

    constructor.__super__     = superclass.prototype;
    constructor.superclass    = superclass;
  }

  if (!constructor.extend) {
    constructor.extend = function(subclass) {
      return structr.apply(this, [this].concat(Array.prototype.slice.call(arguments, 0)));
    }
    constructor.mixin = function(proto) {
      _copy(this.prototype, arguments);
    }
  }

  return constructor;
}


module.exports = structr;
},{}]},{},[1])
;