module.exports = function(fragment, block, element, text, modifiers) {
    return fragment([ text(""), element("form", {
        "data-bind": [ {
            onSubmit: {
                fn: function() {
                    return this.call("submit", []).value();
                },
                refs: [ "submit" ]
            }
        } ]
    }, [ text(" ") ]), text("") ]);
};