"use strict";
// --BEGIN PREAMBLE--
/// //Invoke worker
/// var exports = {};
/// addEventListener('fetch', event => {
///   event.respondWith(fetchAndApply(event.request))
/// });
///
/// async function fetchAndApply(request) {
///   let worker = new exports.Worker();
///   return worker.handle(request);
/// }
// --END PREAMBLE--
exports.__esModule = true;
// --BEGIN COMMENT--
// mock the methods and objects that will be available in the browser
var node_fetch_1 = require("node-fetch");
// --END COMMENT--
var Worker = /** @class */ (function () {
    function Worker() {
    }
    Worker.prototype.handle = function (request) {
        return new node_fetch_1.Response('Hello, world!');
    };
    return Worker;
}());
exports.Worker = Worker;
