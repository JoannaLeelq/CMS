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
// /** */
// function MessageContent(props) {
//   const [paginator, setPaginator] = useState({ limit: 10, page: 1 });
//   const [messages, setMessages] = useState([]);
//   const [notification, setNotification] = useState([]);
//   const [hasMore, setHasMore] = useState(true);
//   const type = props.type;
//   console.log('%c [ type ]', 'font-size:13px; background:pink; color:#bf2c9f;', type);
//   const [totalNotification, setTotalNotification] = useState(0);
//   const [totalMessage, setTotalMessage] = useState(0);

//   const dataSource = type === 'notification' ? notification : messages;

//   useEffect(() => {
//     apiService.getMessage(paginator).then((res) => {
//       const { data } = res;

//       // const total = data.total;
//       const newMessages = data?.messages.filter((item) => item.type === 'message');
//       const newNotification = data?.messages.filter((item) => item.type === 'notification');
//       const displayedMessages = [...messages, ...newMessages];
//       const displayedNotification = [...notification, ...newNotification];
//       const totalMessagesNum = type === 'notification' ? totalNotification : totalMessage;
//       console.log(
//         '%c [ totalMessagesNum ]',
//         'font-size:13px; background:pink; color:#bf2c9f;',
//         totalMessagesNum
//       );
//       setMessages(displayedMessages);
//       setNotification(displayedNotification);

//       const isEnd =
//         type === 'notification'
//           ? totalMessagesNum > displayedNotification.length
//           : totalMessagesNum > displayedMessages.length;

//       setHasMore(isEnd);
//     });
//   }, [props.clearAll]);

//   return (
//     <InfiniteScroll
//       next={() => setPaginator({ ...paginator, page: paginator.page + 1 })}
//       hasMore={hasMore}
//       loader={
//         <div style={{ textAlign: 'center' }}>
//           <Spin />
//         </div>
//       }
//       dataLength={dataSource.length}
//       endMessage={<div style={{ textAlign: 'center' }}>No more</div>}
//       scrollableTarget={props.scrollTarget}
//     >
//       <List
//         itemLayout="vertical"
//         dataSource={dataSource}
//         renderItem={(item, index) => (
//           <List.Item
//             key={index}
//             style={{ opacity: item.status ? 0.4 : 1, marginLeft: '15px' }}
//             actions={[
//               <Space>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</Space>,
//             ]}
//             onClick={() => {
//               if (item.status) {
//                 return;
//               }
//             }}
//           >
//             <List.Item.Meta
//               avatar={<Avatar icon={<UserOutlined />} />}
//               title={item.from.nickname}
//               description={item.content}
//             />
//           </List.Item>
//         )}
//       ></List>
//     </InfiniteScroll>
//   );
// }

// export function MessagePanel() {
//   const tabTypes = ['notification', 'message'];
//   const [activeTab, setActiveTab] = useState('notification');

//   const { messageStore, dispatch } = useMessageStatistic();
//   const [message, setMessage] = useState(null);
//   const [clean, setClean] = useState({
//     notification: 0,
//     message: 0,
//   });

//   const localhostData = storage.getUserInfo();
//   console.log(
//     '%c [ localhostData ]',
//     'font-size:13px; background:pink; color:#bf2c9f;',
//     localhostData
//   );

//   // const role = localhostData.role;
//   const role = 'manager';

//   useEffect(() => {
//     // const req = {
//     //   userId: storage ? storage.getUserInfo()['userId'] : null,
//     // };

//     apiService.getMessageStatistics().then((res) => {
//       const { data } = res;
//       const receiveData = data?.receive;

//       // dispatch({
//       //   type: 'increment',
//       //   payload: { type: 'message', count: receiveData.message.unread },
//       // });
//       // dispatch({
//       //   type: 'increment',
//       //   payload: { type: 'notification', count: receiveData.notification.unread },
//       // });
//     });

//     /**
//      * use sse steps:
//      * 1. 浏览器生成一个EventSource实例 var source = new EventSource(url);
//      * 2. 客户端收到服务器发来的数据，就会触发message事件，可以在onmessage属性的回调函数。
//      * 3. close方法用于关闭 SSE 连接
//      * 参考连接：https://www.ruanyifeng.com/blog/2017/05/server-sent_events.html
//      */
//     const sse = apiService.messageEvent();

//     sse.onmessage = (event) => {
//       let { data } = event;

//       data = JSON.parse(data || {});

//       if (data.type !== 'heartbeat') {
//         const content = data.content;

//         if (content.type === 'message') {
//           notification.info({
//             message: `You have a message from ${content.from.nickname}`,
//             description: content.content,
//           });
//         }

//         setMessage(content);
//         // dispatch({ type: 'increment', payload: { type: content.type, count: 1 } });
//       }
//     };

//     return () => {
//       sse.close();
//       // dispatch({ type: 'reset' });
//     };
//   }, []);

//   const { TabPane } = Tabs;

//   const dropDownContent = (
//     <>
//       <Tabs
//         renderTabBar={(props, DefaultTabBar) => (
//           <TabNavContainer>
//             <DefaultTabBar {...props} />
//           </TabNavContainer>
//         )}
//         onChange={(tabTypes) => {
//           if (tabTypes !== activeTab) {
//             setActiveTab(tabTypes);
//           }
//         }}
//         animated
//       >
//         {tabTypes.map((type, index) => {
//           // const unreadCount = messageStore[type]
//           return (
//             <TabPane tab={`${type}`} key={index}>
//               <MessageContainer id={type}>
//                 <MessageContent
//                   type={type}
//                   scrollTarget={type}
//                   clearAll={clean[type]}
//                   // onRead={(count) => {
//                   //   dispatch({ type: 'decrement', payload: { type, count } });
//                   // }}
//                   message={message}
//                 />
//               </MessageContainer>
//             </TabPane>
//           );
//         })}
//       </Tabs>

//       <Footer justify="space-between" align="middle">
//         <Col span={12}>
//           <Button>Mark all as read</Button>
//         </Col>
//         <Col span={12}>
//           <Button>
//             <Link href={`/dashboard/${role}/message`}>View history</Link>
//           </Button>
//         </Col>
//       </Footer>
//     </>
//   );

//   return (
//     <Badge size="small" count={73} offset={[10, 0]}>
//       <HeaderIcon>
//         <Dropdown
//           placement="bottomRight"
//           trigger={['click']}
//           overlay={dropDownContent}
//           overlayStyle={{
//             background: '#fff',
//             borderRadius: 4,
//             width: 400,
//             height: 500,
//             overflow: 'hidden',
//           }}
//         >
//           <BellOutlined style={{ fontSize: 24, marginTop: 5 }} />
//         </Dropdown>
//       </HeaderIcon>
//     </Badge>
//   );
// }

  

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
