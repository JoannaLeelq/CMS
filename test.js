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

var a = [1, 2, 3, 4, 5, 6];
a.forEach((value, index) => {
  a[index] = value + 1;
});
console.log(a);
