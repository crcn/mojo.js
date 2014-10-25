var Router = require("./router");

module.exports = function (options) {
  return new Router(options);
}

module.exports.listeners = require("./listeners");