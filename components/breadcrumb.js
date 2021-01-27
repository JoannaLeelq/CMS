import { Breadcrumb } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { routes } from '../lib/constant/routes';
import { getSideNavNameByPath } from '../lib/util/side-nav';
import { useUserType } from '../components/custom-hooks/loginState';
import { Role } from '../lib/constant/role';
import { deepSearchFactory, deepSearchRecordFactory } from '../lib/util/deep-search';
import { subPath } from '../lib/services/api-path';

export default function AppBreadcrumb() {
  const router = useRouter();
  const userType = useUserType();
  const path = router.pathname;
  const paths = path.split('/').slice(1); //["dashboard", "manager", "students"]
  const root = '/' + paths.slice(0, 2).join('/');
  const sub = paths.slice(2);
  const sideNav = routes[userType];
  const sideNames = getSideNavNameByPath(sideNav, path);

  return (
    <Breadcrumb style={{ margin: '0 16px', padding: 16 }}>
      <Breadcrumb.Item key={root}>
        <Link href={root}>{`CMS ${userType.toUpperCase()} SYSTEM`}</Link>
      </Breadcrumb.Item>

      {sideNames.map((item, index) => {
        console.log(item);
        if (item === 'Detail') {
          return <Breadcrumb.Item key={index}>Detail</Breadcrumb.Item>;
        }

        const search = deepSearchRecordFactory(
          'subNav',
          item,
          (headNode, value) => headNode.label === value
        );

        const searchResult = search(sideNav);

        const { navs } = searchResult.reduce(
          (acc, cur) => {
            const singleItem = acc.source[acc.source.length + cur];
            return { source: singleItem.subNav, navs: [...acc.navs, singleItem] };
          },
          { source: sideNav, navs: [] }
        );

        console.log(navs);
        const subPath = navs
          .map((item) => item.path)
          .reduce((acc, cur) => [...acc, ...cur], [])
          .filter((item) => !!item)
          .join('/');
        console.log(subPath);
        const isText = index === sideNames.length - 1;

        return (
          <Breadcrumb.Item key={index}>
            {isText ? item : <Link href={`${root}/${subPath}`}>{item}</Link>}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
  /** 
  return (
    <Breadcrumb style={{ margin: '0 16px', padding: 16 }}>
      <Breadcrumb.Item key={root}>
        <Link href={root}>{`CMS ${userType.toUpperCase()} SYSTEM`}</Link>
      </Breadcrumb.Item>
      {sub
        .map((item, index) => {
          const path = [root, ...sub.slice(0, index + 1)].join('/');
          const sideNames = getSideNavNameByPath(sideNav, path); //["Students", "Student List"] or ['Detail']
          console.log('sideNames', sideNames);
          return [Role.Manager, Role.Student, Role.Teacher].find((role) => role === item)
            ? null
            : sideNames.map((singleName) => {
                const search = deepSearchFactory(
                  'subNav',
                  singleName,
                  (headNode, value) => headNode.label === value
                );
                const searchResult = search(sideNav);
                console.log('searchResult', searchResult);
                return (
                  <Breadcrumb.Item key={index}>
                    {index === sub.length - 1 || !searchResult.path.length ? (
                      singleName
                    ) : (
                      <Link href={path}>{singleName}</Link>
                    )}
                  </Breadcrumb.Item>
                );
              });
        }, [])
        .reduce((acc, cur) => [...acc, ...cur], [])}
    </Breadcrumb>
  );
  */
}
