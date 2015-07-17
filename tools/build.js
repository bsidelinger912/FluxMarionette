{
    "baseUrl": "../src",
    "paths": {
        "jquery": "empty:",
        "underscore": "empty:",
        "backbone.marionette": "empty:",
        "backbone.radio": "empty:"
    },
    "include": ["../tools/almond", "flux.marionette"],
    //"exclude": ["jquery", "underscore", "backbone.marionette", "backbone.radio"],
    "out": "../flux.marionette.min.js",
    "wrap": {
        "startFile": "wrap.start",
        "endFile": "wrap.end"
    }

    //node tools/r.js -o tools/build.js
}
