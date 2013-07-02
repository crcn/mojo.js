


define(["require"], function(require) {

    var __dirname = "modules/toarray",
    __filename    = "modules/toarray/index.js",
    module        = { exports: {} },
    exports       = module.exports,
    define        = undefined,
    window        = exports,
    global        = window;

    

    module.exports = function(item) {
  if(item === undefined)  return [];
  return Object.prototype.toString.call(item) === "[object Array]" ? item : [item];
}

    return module.exports;
});