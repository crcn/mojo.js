module.exports = function(paper) {
    return paper.create().nodeBinding("input", {
        attrs: {
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
        }
    });
};