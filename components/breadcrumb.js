import { Breadcrumb } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { routes } from '../lib/constant/routes';
// import { deepSearchFactory, getSideNavNameByPath } from '../lib/util';
import { useUserType } from '../components/custom-hooks/loginState';

export default function AppBreadcrumb() {
  const router = useRouter();
  const path = router.pathname;
  const paths = path.split('/').slice(2);
  // console.log(paths);

  return (
    <Breadcrumb style={{ margin: '0 16px', padding: 16 }}>
      <Breadcrumb.Item>CMS MANAGER SYSTEM</Breadcrumb.Item>
      {paths.map((item) => {
        return <Breadcrumb.Item>{item}</Breadcrumb.Item>;
      })}
    </Breadcrumb>
  );
}
