import React, { useState, useEffect, useContext } from 'react';
import { Tabs, Dropdown, Row, Col, Button, Badge, message, notification } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import apiService from '../../lib/services/api-service';
import storage from '../../lib/services/storage';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Avatar, List, Spin, Space } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import { UserOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useMessageStatistic, MessageStatisticsContext } from '../provider';

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

const HeaderIcon = styled.div`
  font-size: 18px;
  color: #fff;
  cursor: pointer;
  transition: color 0.3s;
  &:hover {
    color: #1890ff;
  }
`;

function MessageContent(props) {
  const [paginator, setPaginator] = useState({ limit: 10, page: 1 });
  const [messages, setMessages] = useState([]);
  const [notification, setNotification] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const type = props.type;
  const [totalNotification, setTotalNotification] = useState(0);
  const [totalMessage, setTotalMessage] = useState(0);
  const [dataSource, setDataSource] = useState([]);

  // const dataSource = props.type === 'notification' ? notification : messages;
  console.log('props',props);

  // get data based on the type
  // useEffect(()=>{
  //   apiService.getMessage(paginator).then((res) => {
  //     const {data} = res;

  //     const newMessages = data?.messages.filter((item) => item.type === 'message');
  //     const newNotification = data?.messages.filter((item) => item.type === 'notification');
  //     const displayedMessages = [...messages, ...newMessages];
  //     const displayedNotification = [...notification, ...newNotification];
  //     const totalMessagesNum = type === 'notification' ? totalNotification : totalMessage;

  //     setMessages(displayedMessages);
  //     setNotification(displayedNotification);

  //     const isEnd =
  //       type === 'notification'
  //         ? totalMessagesNum == displayedNotification.length
  //         : totalMessagesNum == displayedMessages.length;

  //     setDataSource(props.type === 'message'? displayedMessages:displayedNotification);
  //     setHasMore(isEnd);

  //   });

  // },[props.type, paginator, props.message]);

  // clear all after click mark all as read
  useEffect(() => {
    if(props.clearAll && dataSource && dataSource.length){
      console.log('datasource', dataSource);

    }
    apiService.getMessage(paginator).then((res) => {
      const { data } = res;
      console.log('%c [ data ]', 'font-size:13px; background:pink; color:#bf2c9f;', data);

      // const total = data.total;
      const newMessages = data?.messages.filter((item) => item.type === 'message');
      const newNotification = data?.messages.filter((item) => item.type === 'notification');
      const displayedMessages = [...messages, ...newMessages];
      const displayedNotification = [...notification, ...newNotification];
      const totalMessagesNum = type === 'notification' ? totalNotification : totalMessage;

      setMessages(displayedMessages);
      setNotification(displayedNotification);

      const isEnd =
        type === 'notification'
          ? totalMessagesNum == displayedNotification.length
          : totalMessagesNum == displayedMessages.length;

      setHasMore(isEnd);
    });
  }, [props.clearAll]);

  // useEffect(() => {
  //   if (!!props.message && props.message.type === props.type) {
  //     console.log('%c [ props.message ]', 'font-size:13px; background:pink; color:#bf2c9f;', props.message)
      
  //     setDataSource([props.message, ...dataSource]);
  //   }
  // }, [props.message]);

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

export function MessagePanel(props) {
  const tabTypes = ['notification', 'message'];
  const [activeTab, setActiveTab] = useState('notification');
  const { messageStore, dispatch } = useMessageStatistic();
  const [message, setMessage] = useState(null);
  const [clean, setClean] = useState({
    notification: 0,
    message: 0,
  });
  
  const localhostData = storage.getUserInfo();

  // const role = localhostData['role'];
  const role = 'manager';

  useEffect(() => {
    const req = {
      userId: storage ? storage.getUserInfo()['userId'] : null,
    };

    apiService.getMessageStatistics(req).then((res) => {
      const { data } = res;
      const receiveData = data?.receive;
      
      console.log('%c [ receiveData ]', 'font-size:13px; background:pink; color:#bf2c9f;', receiveData)

      dispatch({
        type: 'increment',
        payload: { type: 'message', count: receiveData.message.unread },
      });
      dispatch({
        type: 'increment',
        payload: { type: 'notification', count: receiveData.notification.unread },
      });
    });

    /**
     * use sse steps:
     * 1. 浏览器生成一个EventSource实例 var source = new EventSource(url);
     * 2. 客户端收到服务器发来的数据，就会触发message事件，可以在onmessage属性的回调函数。
     * 3. close方法用于关闭 SSE 连接
     * 参考连接：https://www.ruanyifeng.com/blog/2017/05/server-sent_events.html
     */
    const sse = apiService.messageEvent();

    sse.onmessage = (event) => {
      let { data } = event;

      data = JSON.parse(data || {});

      if (data.type !== 'heartbeat') {
        const content = data.content;

        if (content.type === 'message') {
          notification.info({
            message: `You have a message from ${content.from.nickname}`,
            description: content.content,
          });
        }

        setMessage(content);
        dispatch({ type: 'increment', payload: { type: content.type, count: 1 } });
      }
    };

    return () => {
      sse.close();
      dispatch({ type: 'reset' });
    };
  }, []);

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
          // const unreadCount = messageStore[type]
          return (
            <TabPane tab={`${type}`} key={index}>
              <MessageContainer id={type}>
                <MessageContent
                  type={type}
                  scrollTarget={type}
                  clearAll={clean[type]}
                  onRead={(count) => {
                    dispatch({ type: 'decrement', payload: { type, count } });
                  }}
                  message={message}
                />
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
            <Link href={`/dashboard/${role}/message`}>View history</Link>
          </Button>
        </Col>
      </Footer>
    </>
  );

  return (
    // <Badge size="small" count={messageStore.total} offset={[10, 0]}>
    //   <HeaderIcon>
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
    //   </HeaderIcon>
    // </Badge>
  );
}
