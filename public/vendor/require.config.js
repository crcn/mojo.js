var jam = {
    "packages": [
        {
            "name": "async",
            "location": "vendor/async",
            "main": "lib/async.js"
        },
        {
            "name": "asyngleton",
            "location": "vendor/asyngleton",
            "main": "./lib/index.js"
        },
        {
            "name": "backbone",
            "location": "vendor/backbone",
            "main": "./backbone.js"
        },
        {
            "name": "comerr",
            "location": "vendor/comerr",
            "main": "./lib/index.js"
        },
        {
            "name": "crema",
            "location": "vendor/crema",
            "main": "./lib/index.js"
        },
        {
            "name": "cstep",
            "location": "vendor/cstep",
            "main": "./lib/index.js"
        },
        {
            "name": "disposable",
            "location": "vendor/disposable",
            "main": "./lib/index.js"
        },
        {
            "name": "dolce",
            "location": "vendor/dolce",
            "main": "./lib/index.js"
        },
        {
            "name": "dref",
            "location": "vendor/dref",
            "main": "./lib/index.js"
        },
        {
            "name": "eventemitter2",
            "location": "vendor/eventemitter2",
            "main": "./lib/eventemitter2.js"
        },
        {
            "name": "events",
            "location": "vendor/events",
            "main": "./index.js"
        },
        {
            "name": "handlebars",
            "location": "vendor/handlebars",
            "main": "handlebars.js"
        },
        {
            "name": "jquery",
            "location": "vendor/jquery",
            "main": "jquery.js"
        },
        {
            "name": "jquery-transit",
            "location": "vendor/jquery-transit",
            "main": "jquery.transit.js"
        },
        {
            "name": "outcome",
            "location": "vendor/outcome",
            "main": "./lib/index.js"
        },
        {
            "name": "require-css",
            "location": "vendor/require-css",
            "main": "css.js"
        },
        {
            "name": "rivets",
            "location": "vendor/rivets",
            "main": "./lib/rivets.js"
        },
        {
            "name": "sift",
            "location": "vendor/sift",
            "main": "./sift.js"
        },
        {
            "name": "step",
            "location": "vendor/step",
            "main": "./lib/step.js"
        },
        {
            "name": "strscanner",
            "location": "vendor/strscanner",
            "main": "./lib/index.js"
        },
        {
            "name": "structr",
            "location": "vendor/structr",
            "main": "./lib/index.js"
        },
        {
            "name": "text",
            "location": "vendor/text",
            "main": "text.js"
        },
        {
            "name": "tq",
            "location": "vendor/tq",
            "main": "./lib/index.js"
        },
        {
            "name": "underscore",
            "location": "vendor/underscore",
            "main": "./underscore.js"
        }
    ],
    "version": "0.2.15",
    "shim": {
        "jquery-transit": {
            "deps": [
                "jquery"
            ]
        }
    }
};

if (typeof require !== "undefined" && require.config) {
    require.config({
    "paths": {
        "templates": "public/templates"
    },
    "packages": [
        {
            "name": "async",
            "location": "vendor/async",
            "main": "lib/async.js"
        },
        {
            "name": "asyngleton",
            "location": "vendor/asyngleton",
            "main": "./lib/index.js"
        },
        {
            "name": "backbone",
            "location": "vendor/backbone",
            "main": "./backbone.js"
        },
        {
            "name": "comerr",
            "location": "vendor/comerr",
            "main": "./lib/index.js"
        },
        {
            "name": "crema",
            "location": "vendor/crema",
            "main": "./lib/index.js"
        },
        {
            "name": "cstep",
            "location": "vendor/cstep",
            "main": "./lib/index.js"
        },
        {
            "name": "disposable",
            "location": "vendor/disposable",
            "main": "./lib/index.js"
        },
        {
            "name": "dolce",
            "location": "vendor/dolce",
            "main": "./lib/index.js"
        },
        {
            "name": "dref",
            "location": "vendor/dref",
            "main": "./lib/index.js"
        },
        {
            "name": "eventemitter2",
            "location": "vendor/eventemitter2",
            "main": "./lib/eventemitter2.js"
        },
        {
            "name": "events",
            "location": "vendor/events",
            "main": "./index.js"
        },
        {
            "name": "handlebars",
            "location": "vendor/handlebars",
            "main": "handlebars.js"
        },
        {
            "name": "jquery",
            "location": "vendor/jquery",
            "main": "jquery.js"
        },
        {
            "name": "jquery-transit",
            "location": "vendor/jquery-transit",
            "main": "jquery.transit.js"
        },
        {
            "name": "outcome",
            "location": "vendor/outcome",
            "main": "./lib/index.js"
        },
        {
            "name": "require-css",
            "location": "vendor/require-css",
            "main": "css.js"
        },
        {
            "name": "rivets",
            "location": "vendor/rivets",
            "main": "./lib/rivets.js"
        },
        {
            "name": "sift",
            "location": "vendor/sift",
            "main": "./sift.js"
        },
        {
            "name": "step",
            "location": "vendor/step",
            "main": "./lib/step.js"
        },
        {
            "name": "strscanner",
            "location": "vendor/strscanner",
            "main": "./lib/index.js"
        },
        {
            "name": "structr",
            "location": "vendor/structr",
            "main": "./lib/index.js"
        },
        {
            "name": "text",
            "location": "vendor/text",
            "main": "text.js"
        },
        {
            "name": "tq",
            "location": "vendor/tq",
            "main": "./lib/index.js"
        },
        {
            "name": "underscore",
            "location": "vendor/underscore",
            "main": "./underscore.js"
        }
    ],
    "shim": {
        "jquery-transit": {
            "deps": [
                "jquery"
            ]
        }
    }
});
}
else {
    var require = {
    "paths": {
        "templates": "public/templates"
    },
    "packages": [
        {
            "name": "async",
            "location": "vendor/async",
            "main": "lib/async.js"
        },
        {
            "name": "asyngleton",
            "location": "vendor/asyngleton",
            "main": "./lib/index.js"
        },
        {
            "name": "backbone",
            "location": "vendor/backbone",
            "main": "./backbone.js"
        },
        {
            "name": "comerr",
            "location": "vendor/comerr",
            "main": "./lib/index.js"
        },
        {
            "name": "crema",
            "location": "vendor/crema",
            "main": "./lib/index.js"
        },
        {
            "name": "cstep",
            "location": "vendor/cstep",
            "main": "./lib/index.js"
        },
        {
            "name": "disposable",
            "location": "vendor/disposable",
            "main": "./lib/index.js"
        },
        {
            "name": "dolce",
            "location": "vendor/dolce",
            "main": "./lib/index.js"
        },
        {
            "name": "dref",
            "location": "vendor/dref",
            "main": "./lib/index.js"
        },
        {
            "name": "eventemitter2",
            "location": "vendor/eventemitter2",
            "main": "./lib/eventemitter2.js"
        },
        {
            "name": "events",
            "location": "vendor/events",
            "main": "./index.js"
        },
        {
            "name": "handlebars",
            "location": "vendor/handlebars",
            "main": "handlebars.js"
        },
        {
            "name": "jquery",
            "location": "vendor/jquery",
            "main": "jquery.js"
        },
        {
            "name": "jquery-transit",
            "location": "vendor/jquery-transit",
            "main": "jquery.transit.js"
        },
        {
            "name": "outcome",
            "location": "vendor/outcome",
            "main": "./lib/index.js"
        },
        {
            "name": "require-css",
            "location": "vendor/require-css",
            "main": "css.js"
        },
        {
            "name": "rivets",
            "location": "vendor/rivets",
            "main": "./lib/rivets.js"
        },
        {
            "name": "sift",
            "location": "vendor/sift",
            "main": "./sift.js"
        },
        {
            "name": "step",
            "location": "vendor/step",
            "main": "./lib/step.js"
        },
        {
            "name": "strscanner",
            "location": "vendor/strscanner",
            "main": "./lib/index.js"
        },
        {
            "name": "structr",
            "location": "vendor/structr",
            "main": "./lib/index.js"
        },
        {
            "name": "text",
            "location": "vendor/text",
            "main": "text.js"
        },
        {
            "name": "tq",
            "location": "vendor/tq",
            "main": "./lib/index.js"
        },
        {
            "name": "underscore",
            "location": "vendor/underscore",
            "main": "./underscore.js"
        }
    ],
    "shim": {
        "jquery-transit": {
            "deps": [
                "jquery"
            ]
        }
    }
};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = jam;
}