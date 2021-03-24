import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import apiService from '../../../lib/services/api-service';
import { AlertOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Col, List, Row, Select, Space, Spin, Typography } from 'antd';
import APPLayout from '../../../components/layout/Layout';
import { format } from 'date-fns';
import { useMessageStatistic } from '../../../components/provider';

export default function Message() {
  const [hasMore, setHasMore] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [source, setSource] = useState({});
  const [chosenType, setType] = useState('all');
  const [paginator, setPaginator] = useState({ limit: 10, page: 1 });
  const [tempData, setTempData] = useState([]);

  const { Title } = Typography;
  
  const {dispatch} = useMessageStatistic();

  useEffect(() => {
    console.log('paginator', paginator);
    apiService.getMessage(paginator).then((res) => {
      console.log('res: ', res);
      const { data } = res;

      const getData = data?.messages;
      const receivedData = [...tempData, ...getData];

      // category by the date {date: message}
      const result = receivedData.reduce((acc, cur) => {
        const key = format(new Date(cur.createdAt), 'yyyy-MM-dd');

        if (!acc[key]) {
          acc[key] = [cur];
        } else {
          acc[key].push(cur);
        }
        return acc;
      }, source);
      
      // change Object to array and save to dataSource
      const resultArray = Object.entries(result).sort((pre, next) => new Date(next[0]).getTime - new Date(pre[0]).getTime());
      
      const isEnd = data?.total > receivedData.length;

      setTempData(receivedData);
      setSource({ ...result });
      setDataSource(resultArray);
      setHasMore(isEnd);
    });
  }, [paginator]);

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
              if (value !== 'all') {
                setPaginator({ limit: 10, page: 1, type: value });
              } else {
                setPaginator({ limit: 10, page: 1 });
              }

              setType(value);
              setSource({});
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
            renderItem={([date, values],index) =>{
              console.log('date, values: ', date, values);
              return (
              <>
                <Space size="large">
                  <Typography.Title level={3}>
                    {date}
                  </Typography.Title>
                </Space>
                {
                  values.map((item, itemIndex) => (
                    <List.Item
                      key = {`${item.createdAt}-${itemIndex}-${chosenType}`}
                      style={{ opacity: item.status ? 0.4 : 1 }}
                      actions={[<Space>{item.createdAt}</Space>]}
                      extra = {
                        <Space>
                          {item.type === 'notification' ? <AlertOutlined /> : <MessageOutlined />}
                        </Space>
                      }
                      onClick={() => {
                        if (item.status === 1) {
                          return;
                        }

                        apiService.changeToRead([item.id]).then(res => {
                          if(res.data){
                            let target = null;

                            console.log(dataSource);
                            dataSource.forEach(([_, values]) => {
                              const searchResult = values.find((value) => value.id === item.id);

                              if (!!searchResult){
                                target = searchResult;
                                // throw new Error('just end loop');
                              }
                            })

                            target.status = 1;
                            setDataSource([...dataSource]);
                            dispatch({ type: 'decrement', payload: { count: 1, type: item.type } });
                          }

                        });
                      }}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={item.from.nickname}
                        description={item.content}
                      />
                    </List.Item>
                  ))
                }
              </>
              );
              
            }

            }

          ></List>
        </InfiniteScroll>
      </div>
    </APPLayout>
  );
}
