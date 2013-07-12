module.exports = function(paper) {
    return paper.create().nodeBinding("select", {
        attrs: {
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
        },
        children: paper.create().html(" ").blockBinding({
            when: {
                fn: function() {
                    return this.ref("selectLabel").value();
                },
                refs: [ "selectLabel" ]
            }
        }, function() {
            return paper.create().html(' <option value="nil"> ').textBinding({
                fn: function() {
                    return this.ref("selectLabel").value();
                },
                refs: [ "selectLabel" ]
            }).html(" </option> ");
        }).html(" ").textBinding({
            html: {
                fn: function() {
                    return this.ref("sections.selectList").value();
                },
                refs: [ "sections.selectList" ]
            }
        }).html(" ")
    });
};