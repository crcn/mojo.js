Nofactor is a light DOM API wrapper that's supported in node.js, and in the browser (IE 6+, Chrome, Firefox, Opera, Safari). It's used for DOM creation / manipulation in [paperclip.js](/classdojo/paperclip.js). [![Alt ci](https://travis-ci.org/classdojo/nofactor.js.png)](https://travis-ci.org/classdojo/nofactor.js)
[![Coverage Status](https://coveralls.io/repos/classdojo/nofactor.js/badge.png)](https://coveralls.io/r/classdojo/nofactor.js)


Example:

```javascript
var nofactor = require("nofactor"),

// pick the default DOM adapter - node, or browser (thin).
nostr = nofactor.string; 

var element = nostr.createElement("div"),
element.setAttribute("id", "test");


console.log(element.toString()); //<div id="test"></div>
```

Custom Elements:

```javascript
var nofactor = require("nofactor");
nostr = nofactor.custom(nofactor.string);

// fix toString for BR tags
nostr.registerElement("br", nofactor.string.Element.extend({
	toString: function () {
		return "<br />"
	}
}));

var element = nostr.createElement("div");
element.appendChild(nostr.createElement("br"));
console.log(element.toString()); // <div><br /></div>
```