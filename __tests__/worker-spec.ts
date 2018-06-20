import { Request } from 'node-fetch';
import { Worker } from '../src/worker';

test('Should say hello', () => {
  const worker = new Worker();
  const request = new Request('https://cryptoserviceworker.com/');
  const response = worker.handle(request);
  expect(response.status).toEqual(200);
  expect(response.body).toEqual('Hello, world!');
});
