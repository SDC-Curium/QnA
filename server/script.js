/* eslint-disable import/no-unresolved */
import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  // http.get('https://test.k6.io');
  const id = Math.floor(Math.random() * 10000);
  http.get(`http://localhost:3000/qa/${id}`);
  sleep(1);
}
