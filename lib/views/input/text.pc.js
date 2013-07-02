


define(["require"], function(require) {

    var __dirname = "modules/mojojs/lib/views/input",
    __filename    = "modules/mojojs/lib/views/input/text.pc.js",
    module        = { exports: {} },
    exports       = module.exports,
    define        = undefined,
    window        = exports,
    global        = window;

    

    module.exports = function(paper) {
    return paper.create().nodeBinding("input", {
        attrs: {
            type: [ "text" ],
            name: [ {
                fn: function() {
                    return this.ref("name").value();
                },
                refs: [ "name" ]
            } ]
        }
    });
};

    return module.exports;
});