module.exports = mojo.models.Collection.extend({
  createModel: function (options) {
    return this.application.models.create("todo", options);
  }
});