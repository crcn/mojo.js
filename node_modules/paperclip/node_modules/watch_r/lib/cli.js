var structr = require("structr"),
watch_r     = require("./"),
_           = require("underscore"),
ejs         = require("ejs"),
child_process = require("child_process"),
spawn = child_process.spawn,
exec = child_process.exec,
tq = require("tq");

module.exports = structr({

  /**
   */

  "start": function (options)  {
    var self = this;

    this._options = options;
    this._tq = tq.create().start();
    this._output  = this._fixPath(options.output || options.input);
    this._input   = this._fixPath(options.input);
    this._delay   = options.delay || 500;
    this._changed = {}

    watch_r(this._input, { watch: options.close !== true }, function(err, monitor) {
      ["file", "change", "remove"].forEach(function(event) {
        monitor.on(event, function(target) {
          self._change(target);
        })
      })
    });


    this._process = _.debounce(function() {
      self._process2();
    }, this._delay);
  },

  /**
   */

  "_fixPath": function(path) {
    return String(path).replace(/^\./, process.cwd()).replace(/^~/, process.env.HOME);
  },

  /**
   */

  "_change": function (target) {
    this._changed[target.path] = 1;
    this._process();
  },

  /**
   */

  "_process2": function () {
    if(this._options.each) {
      this._each();
    }
    if(this._options.restart) {
      this._restart();
    }

    this._changed = {};
  },


  /**
   */

  "_each": function() {
    var self = this;
    Object.keys(this._changed).forEach(function(file) {
      self._tq.push(function(next) {

        var command = ejs.render(self._options.each, { input: file, output: self._dstFile(file) });

        function ex(command, callback) {

          var cmd, search;

          //embedded command - just like ``
          if(cmd = command.match(search = /\{([^}]+)\}/)) {
            ex(cmd[1], function(err, stdout) {
              command = command.replace(search, stdout.replace(/[\n\r]+/, ""));
              ex(command, callback);
            });
          } else {
            exec(command, function(err, stdout, stderr) {
              process.stdout.write(stdout);
              process.stderr.write(stderr);
              callback.apply(this, arguments);
            });
          }
        }

        ex(command, function(err, stdout, stderr) {
          next();
        });


      })

    });
  },

  /**
   */

  "_dstFile": function(source) {
    return source.replace(this._input, this._output);
  }
});