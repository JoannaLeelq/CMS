import React, { useState, useEffect } from 'react';
import { Tabs, Dropdown, Row, Col, Button } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import apiService from '../../lib/services/api-service';
import storage from '../../lib/services/storage';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Avatar, List, Spin, Space } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';

const TabNavContainer = styled.div`
  margin-bottom: 0;
  padding: 10px 20px 0 20px;
  .ant-tabs-nav-list {
    width: 100%;
    justify-content: space-around;
  }
`;

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

function MessageContent(props) {
  const [paginator, setPaginator] = useState({ limit: 10, page: 1 });
  const [messages, setMessages] = useState([]);
  const [notification, setNotification] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const type = props.type;

  const dataSource = type === 'notification' ? notification : messages;

  useEffect(() => {
    apiService.getMessage(paginator).then((res) => {
      const { data } = res;
      const total = data.total;
      const newMessages = data?.messages.filter((item) => item.type === 'message');
      const newNotification = data?.messages.filter((item) => item.type === 'notification');
      const displayedMessages = [...messages, ...newMessages];
      const displayedNotification = [...notification, ...newNotification];

      setMessages(displayedMessages);
      setNotification(displayedNotification);

      setHasMore(total > displayedNotification.length + displayedMessages.length);
    });
  }, [paginator]);

  return (
    <InfiniteScroll
      next={() => setPaginator({ ...paginator, page: paginator.page + 1 })}
      hasMore={hasMore}
      loader={
        <div style={{ textAlign: 'center' }}>
          <Spin />
        </div>
      }
      dataLength={dataSource.length}
      endMessage={<div style={{ textAlign: 'center' }}>No more</div>}
      scrollableTarget={props.scrollTarget}
    >
      <List
        itemLayout="vertical"
        dataSource={dataSource}
        renderItem={(item, index) => (
          <List.Item
            key={index}
            style={{ opacity: item.status ? 0.4 : 1, marginLeft: '15px' }}
            actions={[
              <Space>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</Space>,
            ]}
            onClick={() => {
              if (item.status) {
                return;
              }
            }}
          >
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={item.from.nickname}
              description={item.content}
            />
          </List.Item>
        )}
      ></List>
    </InfiniteScroll>
  );
}

export function MessagePanel() {
  const tabTypes = ['notification', 'message'];
  const [activeTab, setActiveTab] = useState('notification');
  const [message, setMessage] = useState(null);
  const [clean, setClean] = useState({
    notification: 0,
    message: 0,
  });

  const { TabPane } = Tabs;

  const dropDownContent = (
    <>
      <Tabs
        renderTabBar={(props, DefaultTabBar) => (
          <TabNavContainer>
            <DefaultTabBar {...props} />
          </TabNavContainer>
        )}
        onChange={(tabTypes) => {
          if (tabTypes !== activeTab) {
            setActiveTab(tabTypes);
          }
        }}
        animated
      >
        {tabTypes.map((type, index) => {
          return (
            <TabPane tab={`${type} `} key={index}>
              <MessageContainer id={type}>
                <MessageContent type={type} scrollTarget={type} />
              </MessageContainer>
            </TabPane>
          );
        })}
      </Tabs>

      <Footer justify="space-between" align="middle">
        <Col span={12}>
          <Button>Mark all as read</Button>
        </Col>
        <Col span={12}>
          <Button>
            <Link href={`/dashboard/${storage.getUserInfo()['role']}/message`}>View history</Link>
          </Button>
        </Col>
      </Footer>
    </>
  );

  return (
    <Dropdown
      placement="bottomRight"
      trigger={['click']}
      overlay={dropDownContent}
      overlayStyle={{
        background: '#fff',
        borderRadius: 4,
        width: 400,
        height: 500,
        overflow: 'hidden',
      }}
    >
      <BellOutlined style={{ fontSize: 24, marginTop: 5 }} />
    </Dropdown>
  );
}
