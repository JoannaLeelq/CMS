// 阶乘：递归函数
var x = function factorial(x) {
  if (x <= 1) {
    return 1;
  } else {
    return x * factorial(x - 1);
  }
};

// 函数表达式可以作为参数传给其他函数
// data.sort(function (a, b) {
//   return a - b;
// });

// 函数闭包作用域
function getName() {
  const name = 'Nancy';
  return (lastName) => name + lastName;
}

const nameFn = getName();
const name = nameFn('Zh');
console.log(name);
