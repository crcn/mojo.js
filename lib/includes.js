require("zepto"); 
require("inject"); // AMD / commonjs loader
require("inject-css"); 
require("inject-text"); 
require("inject-json"); 

INJECT_PLUGINS.text(Inject);
INJECT_PLUGINS.json(Inject);
INJECT_PLUGINS.css(Inject);