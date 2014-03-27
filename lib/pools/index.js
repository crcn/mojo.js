var EventEmitter = require("bindable").EventEmitter,
boo = require("boojs"),
async = require("async"),
em = new EventEmitter();

var poolOptions = [],
poolparty = require("poolparty"),
pid = 0;

exports.add = function (clazz, options) {

  if (clazz.create) return clazz;

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

  return clazz;
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

  // use global tick for creating views asynchronously
  options.tick = _tick;

  // creates a new view
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

  // create the pool specific to the view
  app._pools[clazz.pid] = pool = poolparty(options);
}


var q = async.queue(function (tick, next) {

  // wait before running next pool job
  setTimeout(function () {

    // wait until there are no user interactions
    boo.run(function () {
      tick();
      next();
    });
  }, 50);
});



/**
 */

function _tick (next) {
  q.push(next);
}
