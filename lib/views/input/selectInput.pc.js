module.exports = function(fragment, block, element, text, modifiers) {
    return fragment([ text(""), element("option", {
        value: [ {
            fn: function() {
                return this.ref("model.value").value();
            },
            refs: [ "model.value" ]
        } ],
        selected: [ {
            fn: function() {
                return this.ref("selected").value() ? "selected" : undefined;
            },
            refs: [ "selected" ]
        } ]
    }, [ text(" "), block({
        fn: function() {
            return this.ref("model.label").value();
        },
        refs: [ "model.label" ]
    }), text(" ") ]), text("") ]);
};