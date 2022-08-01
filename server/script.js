/* eslint-disable import/no-unresolved */
import http from 'k6/http';
import { sleep } from 'k6';

export default function () {
  // http.get('https://test.k6.io');
  const id = Math.floor(Math.random() * 10000);
  http.get(`http://localhost:3000/qa/${id}`);
  sleep(1);
}

// db.air_alliances.aggregate([
//   {
//     $unwind: '$airlines',
//   },
//   {
//     $lookup: {
//       from: 'air_routes',
//       localField: 'airlines',
//       foreignField: 'airline.name',
//       as: 'frequency',
//     },
//   },
//   {
//     $match: {
//       airplane: /747|380/,
//     },
//   },
//   {
//     $group: {
//       _id: '$airline',
//       frequency: {
//         $sum: 1,
//       },
//     },
//   },
//   {
//     $sort: {
//       frequency: -1,
//     },
//   },
// ]);
/*
Using the air_alliances and air_routes collections, find 
which alliance has the most unique carriers(airlines) operating
 between the airports JFK and LHR, in either directions.

Names are distinct, i.e. Delta != Delta Air Lines

src_airport and dst_airport contain the originating and 
terminating airport information.
*/
// db.air_routes.aggregate([
//   {
//     $match: {
//       $or: [{ src_airport: /JFK|LHR/ }, { dst_airport: /JFK|LHR/ }],
//     },
//   },
//   {
//     $lookup: {
//       localField: 'airline.name',
//       from: 'air_alliances',
//       foreignField: 'airlines',
//       as: 'foo',
//     },
//   },
//   {
//     $match: { foo: { $ne: [] } },
//   },
//   {
//     $group: {
//       _id: '$foo.name',
//       count: { $sum: 1 },
//       carriers: {
//         $setIntersection: ['$airline.name'],
//       },
//     },
//   },
//   {
//     $sort: { count: -1 },
//   },
// ]);
