


define(["require"], function(require) {

    var __dirname = "modules/mojojs/lib/views/input",
    __filename    = "modules/mojojs/lib/views/input/select.pc.js",
    module        = { exports: {} },
    exports       = module.exports,
    define        = undefined,
    window        = exports,
    global        = window;

    

    module.exports = function(paper) {
    return paper.create().nodeBinding("select", {
        attrs: {
            name: [ {
                fn: function() {
                    return this.ref("view.name").value();
                },
                refs: [ "view.name" ]
            } ]
        },
        children: paper.create().html(" <option> ").textBinding({
            fn: function() {
                return this.ref("view.selectLabel").value();
            },
            refs: [ "view.selectLabel" ]
        }).html(" </option> ").textBinding({
            html: {
                fn: function() {
                    return this.ref("sections.selectList").value();
                },
                refs: [ "sections.selectList" ]
            }
        }).html(" ")
    });
};

    return module.exports;
});