import { Breadcrumb } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { routes } from '../lib/constant/routes';
import { getSideNavNameByPath } from '../lib/util/side-nav';
import { useUserType } from '../components/custom-hooks/loginState';
import { Role } from '../lib/constant/role';
import { deepSearchFactory } from '../lib/util/deep-search';

export default function AppBreadcrumb() {
  const router = useRouter();
  const userType = useUserType();
  const path = router.pathname;
  const paths = path.split('/').slice(1); //["dashboard", "manager", "students"]
  const root = '/' + paths.slice(0, 2).join('/');
  const sub = paths.slice(2);
  // console.log('sub:', sub);
  const sideNav = routes[userType];

  return (
    <Breadcrumb style={{ margin: '0 16px', padding: 16 }}>
      <Breadcrumb.Item key={root}>
        <Link href={root}>{`CMS ${userType.toUpperCase()} SYSTEM`}</Link>
      </Breadcrumb.Item>
      {sub
        .map((item, index) => {
          const path = [root, ...sub.slice(0, index + 1)].join('/');
          const sideNames = getSideNavNameByPath(sideNav, path); //["Students", "Student List"] or ['Detail']

          return [Role.Manager, Role.Student, Role.Teacher].find((role) => role === item)
            ? null
            : sideNames.map((singleName) => {
                const search = deepSearchFactory(
                  'subNav',
                  singleName,
                  (headNode, value) => headNode.label === value
                );
                const searchResult = search(sideNav);
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
}
