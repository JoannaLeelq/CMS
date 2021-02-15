// import '../../pages/dashboard/students/node_modules/antd/dist/antd.css';
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SelectOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { Layout, Menu, Breadcrumb } from 'antd';
import React, { children, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import apiService from '../../lib/services/api-service';
import { routes } from '../../lib/constant/routes';
import { useUserType } from '../custom-hooks/loginState';
import storage from '../../lib/services/storage';
import { generateKey, getActiveKey } from '../../lib/util/side-nav';
import SubMenu from 'antd/lib/menu/SubMenu';
import AppBreadcrumb from '../breadcrumb';

const { Header, Sider, Content } = Layout;

const Logo = styled.div`
  height: 64px;
  display: inline-flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: #fff;
  letter-space: 5px;
  text-shadow: 5px 1px 5px;
  transform: rotateX(45deg);
  font-family: monospace;
`;

const HeaderIcon = styled.div`
  font-size: 18px;
  color: #fff;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #1890ff;
  }
`;

const StyledLayoutHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const StyledContent = styled(Content)`
  margin: 16px;
  background-color: #fff;
  padding: 16px;
  min-height: auto;
`;

const getMenuConfig = (data) => {
  const key = getActiveKey(data);
  const defaultSelectedKeys = key.split('/').pop();
  const defaultOpenKeys = key.split('/').slice(0, -1);

  return { defaultSelectedKeys, defaultOpenKeys };
};

function renderMenuItems(data, parent = '') {
  const userType = useUserType();

  return data.map((item, index) => {
    const key = generateKey(item, index);

    if (item.subNav && !!item.subNav.length) {
      return (
        <SubMenu key={key} icon={item.icon} title={item.label}>
          {renderMenuItems(item.subNav, item.path.join('/'))}
        </SubMenu>
      );
    } else {
      return (
        <Menu.Item key={key} title={item.label} icon={item.icon}>
          {!!item.path.length || item.label.toLowerCase() === 'overview' ? (
            <Link
              href={['/dashboard', userType, parent, ...item.path]
                .filter((item) => !!item)
                .join('/')}
              replace
            >
              {item.label}
            </Link>
          ) : (
            item.label
          )}
        </Menu.Item>
      );
    }
  });
}

const axios = require('axios');

export default function APPLayout(props) {
  const router = useRouter();
  const [collapsed, toggleCollapse] = useState(false);
  const userType = useUserType();
  const sideNav = routes[userType];
  const menuItems = renderMenuItems(sideNav);
  const { defaultOpenKeys, defaultSelectedKeys } = getMenuConfig(sideNav);

  const toggle = () => {
    toggleCollapse(!collapsed);
  };

  const logoutFunction = async () => {
    const token = localStorage.getItem('token');
    const { data } = await apiService.logout({ token: token });

    if (data) {
      storage.deleteUserInfo();
      router.push('/login');
    }
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(isCollapsed) => toggleCollapse(isCollapsed)}
      >
        <Logo>CMS</Logo>
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={defaultOpenKeys}
          defaultSelectedKeys={defaultSelectedKeys}
        >
          {menuItems}
        </Menu>
      </Sider>

      <Layout id="contentPart">
        <StyledLayoutHeader>
          <HeaderIcon onClick={toggle}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </HeaderIcon>

          <HeaderIcon>
            <LogoutOutlined onClick={logoutFunction} />
          </HeaderIcon>
        </StyledLayoutHeader>

        <AppBreadcrumb />

        <StyledContent>{props.children}</StyledContent>
      </Layout>
    </Layout>
  );
}
