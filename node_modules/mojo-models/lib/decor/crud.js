var memoize = require("./utils/memoize"),
_           = require("lodash"),
hurryup     = require("hurryup"),
async       = require("async");


module.exports = {
  priority: "init",
  getOptions: function (target) {
    return target.persist;
  },
  decorate: function(model) {

    var persist = model.persist;

    if (typeof persist === "function") {
      persist = persist(model);
    }

    model.persist = persist;

    var q = async.queue(function (task, next) {
      task(next);
    });


    function _queue (fn) {
      fn = hurryup(fn, { timeout: 1000 * 10, retry: false });
      q.push(fn);
    }

    model.save = function (complete2) {

      if (typeof complete2 !== "function") complete2 = function() { };

      var self = this;

      model.set("loading", true);

      _queue(function (next) {

        model.emit("willSave");

        function complete (err, data) {

          next();

          if (err) return complete2(err);
          if (typeof data === "object") {
            model.set("data", data);
          }
          model.set("loading", false);
          model.emit("didSave");
          if (model.didSave) model.didSave();
          model.emit("saved");
          complete2(null, model);
        }

        if(persist.save) {
          persist.save.call(self, complete);
        } else {
          complete(new Error("cannot save model"));
        }
      });

      return this;
    };

    model.remove = function (complete) {
      if (typeof complete !== "function") complete = function() { };
      if (!persist.remove) {
        complete(new Error("cannot remove model"));
        return this;
      }

      var self = this;
      model.set("loading", true);

      // dispose immediately - don't wait
      model.dispose();

      _queue(function (next) {
        model.emit("willRemove");
        persist.remove.call(self, function(err) {
          next();
          if (err) return complete(err);
          model.set("loading", false);
          model.emit("didRemove");
          if (model.didRemove) model.didRemove();
          model.emit("removed");
          complete(null, model);
        });
      });
      
      return this;
    };

    model.reload = function (complete) {
      if (typeof complete !== "function") complete = function() { };
      if (!persist.load) {
        complete(new Error("cannot load model"));
        return this;
      } 

      var self = this;

      model.set("loading", true);

      _queue(function (next) {
        persist.load.call(self, function (err, data) {
          next();
          model.set("loading", false);
          if (err) {
            complete(err);
            return model._load.clear();
          }
          if (data != undefined) {
            model.set("data", data);
          }
          complete(null, model);
        });
      });

      return this
    };

    model._load = memoize(_.bind(model.reload, model));
    model.load = function (complete) {
      if (typeof complete !== "function") complete = function() { };
      model._load(complete);
      return this;
    }
  }
}
