import "antd/dist/antd.css";
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SelectOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React, { children, useState } from "react";
import styled from "styled-components";

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

class DashboardLayout extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <Layout style={{ height: "100vh" }}>
        <Sider collapsible collapsed={this.state.collapsed}>
          <Logo>CMS</Logo>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
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
            <HeaderIcon onClick={this.toggle}>
              {this.state.collapsed ? (
                <MenuUnfoldOutlined />
              ) : (
                <MenuFoldOutlined />
              )}
            </HeaderIcon>

            <HeaderIcon>
              <LogoutOutlined />
            </HeaderIcon>
          </StyledLayoutHeader>

          <StyledContent>{this.props.children}</StyledContent>
        </Layout>
      </Layout>
    );
  }
}

export default DashboardLayout;
