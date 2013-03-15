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
            "name": "comerr",
            "location": "vendor/comerr",
            "main": "./lib/index.js"
        },
        {
            "name": "cstep",
            "location": "vendor/cstep",
            "main": "./lib/index.js"
        },
        {
            "name": "dref",
            "location": "vendor/dref",
            "main": "./lib/index.js"
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
            "name": "outcome",
            "location": "vendor/outcome",
            "main": "./lib/index.js"
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
            "main": "underscore.js"
        }
    ],
    "version": "0.2.15",
    "shim": {
        "underscore": {
            "exports": "_"
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
            "name": "comerr",
            "location": "vendor/comerr",
            "main": "./lib/index.js"
        },
        {
            "name": "cstep",
            "location": "vendor/cstep",
            "main": "./lib/index.js"
        },
        {
            "name": "dref",
            "location": "vendor/dref",
            "main": "./lib/index.js"
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
            "name": "outcome",
            "location": "vendor/outcome",
            "main": "./lib/index.js"
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
            "main": "underscore.js"
        }
    ],
    "shim": {
        "underscore": {
            "exports": "_"
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
            "name": "comerr",
            "location": "vendor/comerr",
            "main": "./lib/index.js"
        },
        {
            "name": "cstep",
            "location": "vendor/cstep",
            "main": "./lib/index.js"
        },
        {
            "name": "dref",
            "location": "vendor/dref",
            "main": "./lib/index.js"
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
            "name": "outcome",
            "location": "vendor/outcome",
            "main": "./lib/index.js"
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
            "main": "underscore.js"
        }
    ],
    "shim": {
        "underscore": {
            "exports": "_"
        }
    }
};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = jam;
}