


define(["require"], function(require) {

    var __dirname = "modules/mojojs/lib/views/input",
    __filename    = "modules/mojojs/lib/views/input/selectInput.pc.js",
    module        = { exports: {} },
    exports       = module.exports,
    define        = undefined,
    window        = exports,
    global        = window;

    

    module.exports = function(paper) {
    return paper.create().nodeBinding("option", {
        attrs: {
            value: [ {
                fn: function() {
                    return this.ref("model.value").value();
                },
                refs: [ "model.value" ]
            } ]
        },
        children: paper.create().html(" ").textBinding({
            fn: function() {
                return this.ref("model.label").value();
            },
            refs: [ "model.label" ]
        }).html(" ")
    });
};

    return module.exports;
});