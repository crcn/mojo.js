require("zepto"); 


var allScripts = document.getElementsByTagName("script"),
selfScript     = allScripts[allScripts.length - 1];



require("inject"); // AMD / commonjs loader
require("inject-css"); 
require("inject-text"); 
require("inject-json"); 

INJECT_PLUGINS.text(Inject);
INJECT_PLUGINS.json(Inject);
INJECT_PLUGINS.css(Inject);



if (selfScript.getAttribute("data-inject") === "false") {
  global.define = global.require = void 0;
}