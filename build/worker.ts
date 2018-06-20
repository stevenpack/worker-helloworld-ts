// --BEGIN PREAMBLE--
//Invoke worker
var exports = {};
addEventListener('fetch', event => {
  event.respondWith(fetchAndApply(event.request))
});

async function fetchAndApply(request) {
  let worker = new exports.Worker();
  return worker.handle(request);
}
// --END PREAMBLE--

// Dev environment code block removed by build
export class Worker {
  public handle(request: Request) {
    return new Response('Hello, world!');
  }
}
