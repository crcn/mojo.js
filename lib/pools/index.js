var EventEmitter = require("bindable").EventEmitter,
em = new EventEmitter();

var poolOptions = [],
poolparty = require("poolparty"),
pid = 0;

exports.add = function (clazz, options) {
  
  clazz.pid = ++pid;

  poolOptions.push({
    clazz: clazz,
    options: options
  });

  clazz.create = function (options) {
    return options.application.getPool(clazz).create(options);
  };

  clazz.test = function () {
    return true;
  }

  em.emit("pool", clazz, options);
}

exports.plugin = function (app) {

  app._pools = {};

  app.getPool = function (ops) {
    return this._pools[ops.pid];
  };

  for (var i = poolOptions.length; i--;) {
    var ops = poolOptions[i];
    createPool(ops.clazz, ops.options, app);
  }

  em.on("pool", function (clazz, options) {
    createPool(clazz, options, app);
  });
}

/**
 */

function createPool (clazz, options, app) {

  var pool;

  options.create = function (ops) {
    var item = new clazz(ops, app);
    item.emit("warm");
    item.on("dispose", function () {
      pool.add(item);
    });
    return item;
  };

  options.recycle = function (item, ops) {
    item.reset(ops);
    return item;
  }

  app._pools[clazz.pid] = pool = poolparty(options);
}