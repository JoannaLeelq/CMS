import 'antd/dist/antd.css';
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SelectOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { children, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

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

const axios = require('axios');

export default function APPLayout(props) {
  const router = useRouter();

  const [collapsed, toggleCollapse] = useState(false);

  const toggle = () => {
    toggleCollapse(!collapsed);
  };

  const logoutFunction = async () => {
    await axios
      .get('/api/logoutApp', {
        params: {
          token: localStorage.getItem('token'),
        },
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.clear();
          router.push('login');
        }
      })
      .catch(function (error) {
        message.error('the token does not exist');
      });
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider collapsible collapsed={collapsed}>
        <Logo>CMS</Logo>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" icon={<UserOutlined />}>
            学员列表
          </Menu.Item>

          <Menu.Item key="2" icon={<SelectOutlined />}>
            选择学员
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <StyledLayoutHeader>
          <HeaderIcon onClick={toggle}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </HeaderIcon>

          <HeaderIcon>
            <LogoutOutlined onClick={logoutFunction} />
            {/* <LogoutOutlined /> */}
          </HeaderIcon>
        </StyledLayoutHeader>

        <StyledContent>{props.children}</StyledContent>
      </Layout>
    </Layout>
  );
}
