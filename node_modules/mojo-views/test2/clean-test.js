var mojoViews = require("..");
mojoViews.mainApplication.use(require("mojo-paperclip"));

beforeEach(function () {
    mojoViews.Base.prototype.__decorators = void 0;
})
