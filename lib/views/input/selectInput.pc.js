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