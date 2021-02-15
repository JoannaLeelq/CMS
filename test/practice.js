let path = '/dashboard/role/page/[id]';
const pathList = path.split('/');
const reducer = pathList.reduce((acc, cur) => {
  if (isNaN(Number(cur)) && cur !== '[id]' && cur !== '') {
    acc = acc + '/' + cur;
  }

  return acc;
}, '');
console.log(reducer);
let newPath = path.substring(0, path.lastIndexOf('/'));
