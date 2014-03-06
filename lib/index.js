var views   = require("./views"),
Application = require("./application"),
pools       = require("./pools");

/**
 * @class Mojo
 * @module mojo
 */



module.exports = {

  /**
   * The base mojo.js View
   * @property View
   */

  View        : views.BaseView,

  /**
   * The base mojo.application. This is where all your models / views live.
   * @property Application
   */

  Application : Application,

  /**
   * Registers a class to pool
   * @property pool
   */

  pool        : pools.add
};

if (typeof window !== "undefined") {
  window.mojo = module.exports;
}