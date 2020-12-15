import 'antd/dist/antd.css';
import { Form, Input, Button, Checkbox, Radio, Typography, Row, Col, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { makeServer } from '../../mock';
import { useRouter } from 'next/router';

if (process.env.NODE_ENV === 'development') {
  makeServer({ environment: 'development' });
}

const { Title } = Typography;

const StyledButton = styled(Button)`
  width: 100%;
`;

const LoginTitle = styled(Title)`
  text-align: center;
`;

const axios = require('axios');

export default function Login() {
  const [form] = Form.useForm();
  const router = useRouter();

  const login = async (loginValues) => {
    await axios
      .get('/api/login', {
        params: {
          email: loginValues.email,
          password: loginValues.password,
          loginType: loginValues.loginType,
          remember: loginValues.remember,
        },
      })
      .then(function (response) {
        console.log(response.data.data);
        if (response.status === 200) {
          console.log('success');
          localStorage.setItem('token', response.data.data.token);
          localStorage.setItem('loginType', response.data.data.loginType);
          router.push('dashboard');
        }
      })
      .catch(function (error) {
        console.log(error);
        message.error('the password or email is incorrect');
      });
  };

  return (
    <Row justify="center" style={{ margin: '5%' }}>
      <Col>
        <Form
          name="login"
          initialValues={{
            remember: true,
            loginType: 'student',
          }}
          form={form}
          onFinish={(loginValues) => login(loginValues)}
        >
          <LoginTitle>课程管理助手</LoginTitle>

          <Form.Item
            name="loginType"
            initialValues="student"
            rules={[
              {
                required: true,
                message: 'Please choose a login type',
              },
            ]}
          >
            <Radio.Group buttonStyle="solid" style={{ margin: 16 }}>
              <Radio.Button value="student">Student</Radio.Button>
              <Radio.Button value="teacher">Teacher</Radio.Button>
              <Radio.Button value="manager">Manager</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: '请输入邮箱',
              },
              {
                type: 'email',
                message: '请输入邮箱',
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
              {
                min: 4,
                max: 16,
                message: '密码长度不对',
              },
            ]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>记住我</Checkbox>
          </Form.Item>

          <Form.Item>
            <StyledButton type="primary" htmlType="submit">
              登录
            </StyledButton>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
