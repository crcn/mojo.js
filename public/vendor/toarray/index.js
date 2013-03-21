define(["require"], function(require) {

    var __dirname = "/vendor/toarray",
    __filename    = "/vendor/toarray/index.js",
    module        = { exports: {} },
    exports       = module.exports,
    define        = undefined,
    window        = exports;

    

    module.exports = function(item) {
  if(item === undefined)  return [];
  return item instanceof Array ? item : [item];
}

    return module.exports;
});