var jam = {
    "packages": [],
    "version": "0.2.17",
    "shim": {}
};

if (typeof require !== "undefined" && require.config) {
    require.config({
    "repository": "http://npm.classdojo.com:5984/jam",
    "paths": {
        "templates": "public/templates"
    },
    "packages": [],
    "shim": {}
});
}
else {
    var require = {
    "repository": "http://npm.classdojo.com:5984/jam",
    "paths": {
        "templates": "public/templates"
    },
    "packages": [],
    "shim": {}
};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = jam;
}