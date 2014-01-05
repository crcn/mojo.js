module.exports = function (clazz, options) {

  var pool;

  options.create = function (options) {
    var item = new clazz(options);
    item.emit("warm");
    item.on("dispose", function () {
      pool.add(item);
    });
    return item;
  };

  options.recycle = function (item, options) {
    item.reset(options);
    return item;
  };

  clazz.create = function (options) {
    return pool.create(options);
  }

  return pool = poolparty(options);
}