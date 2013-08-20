module.exports = function(fragment, block, element, text, modifiers) {
    return fragment([ text(""), element("input", {
        type: [ "text" ],
        name: [ {
            fn: function() {
                return this.ref("name").value();
            },
            refs: [ "name" ]
        } ],
        "data-bind": [ {
            value: {
                fn: function() {
                    return this.ref("value").value();
                },
                refs: [ "value" ]
            },
            bothWays: {
                fn: function() {
                    return true;
                },
                refs: []
            }
        } ]
    }), text("") ]);
};