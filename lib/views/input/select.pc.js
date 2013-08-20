module.exports = function(fragment, block, element, text, modifiers) {
    return fragment([ text(""), element("select", {
        name: [ {
            fn: function() {
                return this.ref("name").value();
            },
            refs: [ "name" ]
        } ],
        "data-bind": [ {
            onChange: {
                fn: function() {
                    return this.call("_changeSelect", [ this.ref("event").value() ]).value();
                },
                refs: [ "_changeSelect", "event" ]
            },
            preventDefault: {
                fn: function() {
                    return false;
                },
                refs: []
            }
        } ]
    }, [ text(" "), block({
        when: {
            fn: function() {
                return this.ref("selectLabel").value();
            },
            refs: [ "selectLabel" ]
        }
    }, function(fragment, block, element, text, modifiers) {
        return fragment([ text(" "), element("option", {
            value: [ "nil" ]
        }, [ text(" "), block({
            fn: function() {
                return this.ref("selectLabel").value();
            },
            refs: [ "selectLabel" ]
        }), text(" ") ]), text(" ") ]);
    }), text(" "), block({
        html: {
            fn: function() {
                return this.ref("sections.selectList").value();
            },
            refs: [ "sections.selectList" ]
        }
    }), text(" ") ]), text("") ]);
};