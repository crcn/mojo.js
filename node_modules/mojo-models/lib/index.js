var RegisteredClasses = require("mojo-registered-classes"),
modelDecor            = require("./decor"),
BaseModel             = require("./base/model"),
BaseCollection        = require("./base/collection"),
Application           = require("mojo-application");

module.exports = function (app) {
  app.models = new RegisteredClasses(app);
  app.use(modelDecor);
}

module.exports.Base       = BaseModel;
module.exports.Collection = BaseCollection;


Application.main.use(module.exports);