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

// --BEGIN COMMENT--
// mock the methods and objects that will be available in the browser
import { Request, Response } from 'node-fetch';
// --END COMMENT--
export class Worker {
  public handle(request: Request) {
    return new Response('Hello, world!');
  }
}
