"use strict";
exports.__esModule = true;
var node_fetch_1 = require("node-fetch");
var worker_1 = require("../src/worker");
test('Should say hello', function () {
    var worker = new worker_1.Worker();
    var request = new node_fetch_1.Request('https://cryptoserviceworker.com/');
    var response = worker.handle(request);
    expect(response.status).toEqual(200);
    expect(response.body).toEqual('Hello, world!');
});
