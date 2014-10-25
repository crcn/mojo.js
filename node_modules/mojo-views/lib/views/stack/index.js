var BaseView = require("../base");

function StackView () {
  BaseView.apply(this, arguments);
}

module.exports = BaseView.extend(StackView, {

  /**
   */

  define: ["state"],

  /**
   */

  bindings: {
    "state": function (stateName) {

      if (!stateName) return;

      var prevChild = this.currentChild, currentChild;

      this.set("currentChild", currentChild = this.get("children." + stateName));
      
      if (!currentChild) {
        throw new Error("state '" + stateName + "' does not exist");
      }

      if (currentChild === prevChild) return;

      var self = this;

      // prevent layout thrashing
      this.application.animate({
        update: function () {

          if (prevChild) {
            prevChild.remove();
          }

          self.section.append(currentChild.render());
        }
      });
    },
    "name": function (name) {
      if (this._nameBinding) this._nameBinding.dispose();
      this._nameBinding = this.bind("states." + name, { to: "state" }).now();
    }
  }
});
