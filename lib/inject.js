// injects the main application
var path = require("path");

var mainScript = $("script[data-main]").attr("data-main");

if (mainScript) { 
  Inject.setModuleRoot(path.dirname(mainScript));
  Inject.require.run(path.basename(mainScript)); 
}