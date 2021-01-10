import { memoize } from 'lodash';
import { useRouter } from 'next/router';
import { useUserType } from '../../components/custom-hooks/loginState';

// generate key
export const generateKey = (data, index) => {
  return `${data.label}_${index}`;
};

// get path
const generatePath = (data) => {
  return data.path.join('/');
};

// 通过key 获取当前的sideNav
export const getSideNavNameByKey = (key) => {
  return key.split('/').map((item) => item.split('_')[0]);
};

// 此处用的方法跟Layout.js中renderMenuItems的递归方法一致
const generateFactory = (fn) =>
  function inner(data, current = '') {
    const keys = data.map((item, index) => {
      let key = fn(item, index);

      if (current) {
        key = [current, key].join('/');
      }

      if (item.subNav && !!item.subNav.length) {
        return inner(item.subNav, key).map((item) => item.join('/'));
      } else {
        return [key];
      }
    });

    return keys;
  };

//判断当前路径是否指向一个详情页
const isDetailPath = (path) => {
  const pathArr = path.split('/');
  const length = pathArr.length;
  const last = pathArr[length - 1];
  const reg = /\[.*\]/;

  return reg.test(last);
};

//忽略详情路径
const omitDetailPath = (path) => {
  const isDetail = isDetailPath(path);

  return isDetail ? path.slice(0, path.lastIndexOf('/')) : path;
};

// 根据route找出当前side nav的key， path信息
const getKeyPathInfo = (data) => {
  const useType = useUserType();
  const getPaths = generateFactory(generatePath);
  const paths = getPaths(data)
    .reduce((acc, cur) => [...acc, ...cur], [])
    .map((item) => ['/dashboard', useType, item].filter((item) => !!item).join('/'));
  const getKeys = generateFactory(generateKey);
  const keys = getKeys(data).reduce((acc, cur) => [...acc, ...cur], []);

  return { paths, keys };
};

// getKeyPathInfo的缓存版本
const memoizeGetKeyPathInfo = memoize(getKeyPathInfo, (data) =>
  data.map((item) => item.label).join('-')
);

//get current active key
export const getActiveKey = (data) => {
  const router = useRouter();
  const activeRoute = omitDetailPath(router.pathname);
  const { paths, keys } = memoizeGetKeyPathInfo(data);
  const index = paths.findIndex((item) => item === activeRoute);
  // console.log({ paths, keys });
  return keys[index] || '';
};

// 根据路径获取sideNav 名称
export const getSideNavNameByPath = (data, path) => {
  if (isDetailPath(path)) {
    return ['Detail'];
  }

  const { paths, keys } = memoizeGetKeyPathInfo(data);
  const index = paths.findIndex((item) => item === path);

  return getSideNavNameByKey(keys[index]);
};
