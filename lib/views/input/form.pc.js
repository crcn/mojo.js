module.exports = function(paper) {
    return paper.create().nodeBinding("form", {
        attrs: {
            "data-bind": [ {
                onSubmit: {
                    fn: function() {
                        return this.call("submit", []).value();
                    },
                    refs: [ "submit" ]
                }
            } ]
        },
        children: paper.create().html(" ")
    });
};