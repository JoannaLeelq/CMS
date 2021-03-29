// import '../../pages/dashboard/students/node_modules/antd/dist/antd.css';
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import {
  Avatar,
  Badge,
  Button,
  Col,
  Dropdown,
  Layout,
  List,
  Menu,
  message,
  notification,
  Row,
  Space,
  Spin,
  Tabs,
} from 'antd';
import React, { children, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import apiService from '../../lib/services/api-service';
import { routes } from '../../lib/constant/routes';
import { useUserType } from '../custom-hooks/loginState';
import storage from '../../lib/services/storage';
import { generateKey, getActiveKey } from '../../lib/util/side-nav';
import SubMenu from 'antd/lib/menu/SubMenu';
import AppBreadcrumb from '../breadcrumb';
import { MessagePanel } from '../message/messagePanel';
import { useMessageStatistic, MessageStatisticsContext } from '../provider';

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

// from messagePanel
const MessageContainer = styled.div`
  height: 380px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const Footer = styled(Row)`
  height: 50px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 0 0 4px 4px;
  border: 1px solid #f0f0f0;
  border-left: none;
  border-right: none;
  background: #fff;
  z-index: 9;
  .ant-col {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:first-child {
      box-shadow: 1px 0 0 0 #f0f0f0;
    }
  }
  button {
    border: none;
  }
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
  const [unreadTotalMessages, setUnreadTotalMessages] = useState(0);
  const [messageNum, setMessageNum] = useState(0);
  const [message, setMessage] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const userType = useUserType();
  const sideNav = routes[userType];
  const menuItems = renderMenuItems(sideNav);
  const { defaultOpenKeys, defaultSelectedKeys } = getMenuConfig(sideNav);
  const { messageStore, dispatch } = useMessageStatistic();
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
    <Layout style={{ height: '100vh' }} hasSider={true}>
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

          <Row align="middle">
            <Badge size="small" count={messageStore.total} offset={[10, 0]}>
              <HeaderIcon>
                <MessagePanel />
              </HeaderIcon>
            </Badge>

            <HeaderIcon style={{ paddingLeft: '15px' }}>
              <LogoutOutlined onClick={logoutFunction} />
            </HeaderIcon>
          </Row>
        </StyledLayoutHeader>

        <AppBreadcrumb />

        <StyledContent>{props.children}</StyledContent>
      </Layout>
    </Layout>
  );
}
