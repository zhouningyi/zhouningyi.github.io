     seajs.config({
        base: "./js/",
        alias: {
        // "jquery": "jquery-2.0.3.min.js",
        }
      });
    seajs.use("./js/cMain");////
    
 define(function(require, exports, module) {
 var Controller = require('./cController');
 new Controller();
});
