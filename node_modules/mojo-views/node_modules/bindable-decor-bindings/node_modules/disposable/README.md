```javascript

var disposable = require("disposable")(),
EventEmitter = require("events").EventEmitter,
em = new EventEmitter();


disposable.addTimeout(setTimeout(function() {
	
}, 500));

disposable.addInterval(setInterval(function() {
	
}, 500));


disposable.add(em.on("end", function(){}),
em.on("test", function(){}));