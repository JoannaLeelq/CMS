// function fib_impl(n, cont) {
//   return n < 1
//     ? cont(1)
//     : fib_impl.bind(null, n - 1, function (x) {
//         return fib_impl.bind(null, n - 2, function (y) {
//           return cont.bind(null, x + y);
//         });
//       });
// }

// function fib(n) {
//   return trampoline(
//     fib_impl.bind(null, n, function (r) {
//       return r;
//     })
//   );
// }

// var a = [1, 2, 3, 4, 5, 6];
// a.forEach((value, index) => {
//   a[index] = value + 1;
// });
// console.log(a);

var a = { startDate: '2021-03-18', endDate: '2021-3-23', statistic: { mike: 1 } };
var b = { startDate: '2021-03-18', endDate: '2021-3-23', statistic: { mike: 1 } };
console.log(a == b);
