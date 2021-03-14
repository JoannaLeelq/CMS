import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import apiService from '../../../lib/services/api-service';
import storage from '../../../lib/services/storage';
import { AlertOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Col, List, Row, Select, Space, Spin, Typography } from 'antd';
import APPLayout from '../../../components/layout/Layout';
import { format } from 'date-fns';
import { formatDistanceToNow } from 'date-fns';

export default function Message() {
  const [paginator, setPaginator] = useState({ limit: 10, page: 1 });
  const [messages, setMessages] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [receiveNum, setReceivedNum] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [type, setType] = useState('all');
  const [totalNotification, setTotalNotification] = useState(0);
  const [totalMessage, setTotalMessage] = useState(0);
  const [total, setTotal] = useState(0);
  const [receiveData, setReceiveData] = useState([]);

  const { Title } = Typography;

  useEffect(() => {
    apiService.getMessageStatistics().then((res) => {
      const { data } = res;
      const receiveData = data?.receive;

      setTotalNotification(receiveData.notification.total);
      setTotalMessage(receiveData.message.total);
      setTotal(receiveData.notification.total + receiveData.message.total);
    });
  }, []);

  useEffect(() => {
    apiService.getMessage(paginator).then((res) => {
      const { data } = res;
      let newMessages = [];
      let isEnd = false;

      // const receivedData = [...receiveData, ...data?.messages];
      // setReceiveData(receivedData);
      if (type !== 'all') {
        newMessages = data?.messages.filter((item) => item.type === type);
      } else {
        newMessages = data?.messages;
      }

      const displayedMessages = [...dataSource, ...newMessages];
      setDataSource(displayedMessages);

      if (type !== 'all') {
        isEnd =
          type === 'message'
            ? totalMessage > displayedMessages.length
            : totalMessage > totalNotification.length;
      } else {
        isEnd = total > displayedMessages.length;
      }

      setHasMore(isEnd);
    });
  }, [paginator, type]);

  return (
    <APPLayout>
      <Row align="middle">
        <Col span={8}>
          <Title level={2}>Recent Message</Title>
        </Col>

        <Col span={8} offset={8} style={{ textAlign: 'right' }}>
          <Select
            defaultValue="all"
            onSelect={(value) => {
              setType(value);
              setPaginator({ limit: 10, page: 1 });
              setDataSource([]);
            }}
            style={{ minWidth: 100 }}
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="notification">Notification</Select.Option>
            <Select.Option value="message">Message</Select.Option>
          </Select>
        </Col>
      </Row>

      <div id="msg-container" style={{ padding: '0 20px', overflowY: 'scroll', maxHeight: '75vh' }}>
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
          scrollableTarget="msg-container"
        >
          <List
            itemLayout="vertical"
            dataSource={dataSource}
            renderItem={(item, index) => (
              <List.Item
                key={index}
                style={{ opacity: item.status ? 0.4 : 1, marginLeft: '15px' }}
                actions={[
                  <Space>
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </Space>,
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
      </div>
    </APPLayout>
  );
}
