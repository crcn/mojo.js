var bindable = require("bindable");

module.exports = function (fn, ops) {
  if (!ops) ops = {};

  var em  = new bindable.EventEmitter(),
  ma      = null,
  calling = false;

  var memo = function () {
    var args = Array.prototype.slice.call(arguments, 0);
    var cb = args.pop() || function(){};

    if (ma) {
      return cb.apply(this, ma);
    }

    em.once("done", cb);

    if (calling) return;
    calling = true;

    args.push(function () {

      var args = Array.prototype.slice.call(arguments, 0);

      calling = false;

      if (ops.store !== false) {
        ma = args;
      }

      em.emit.apply(em, ["done"].concat(args));

      if (ops.maxAge) {
        setTimeout(memo.clear, ops.maxAge);
      }
    });

    fn.apply(this, args);
  };

  memo.clear = function () {
    ma = void 0;
  }

  return memo;
}