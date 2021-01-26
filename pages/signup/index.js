import { Form, Input, Button, Checkbox, Radio, Typography, Row, Col, message } from 'antd';
import { LockOutlined, RollbackOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import makeServer from '../../mock';
import { useRouter } from 'next/router';
import { Role } from '../../lib/constant/role';
import apiService from '../../lib/services/api-service';
import { rootPath, subPath } from '../../lib/services/api-path';
import storage from '../../lib/services/storage';
import Link from 'next/link';

// if (process.env.NODE_ENV === 'development') {
//   makeServer({ environment: 'development' });
// }

const { Title } = Typography;

const StyledButton = styled(Button)`
  width: 100%;
`;

const LoginTitle = styled(Title)`
  text-align: center;
`;

// const axios = require('axios');

export default function Login() {
  const [form] = Form.useForm();
  const router = useRouter();

  const signup = async (signupValue) => {
    const { data } = await apiService.signup(signupValue);
    console.log(data);
    if (!!data) {
      storage.setUserInfo(data);
      router.push(`/dashboard/${data.loginType}`);
    }
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
          onFinish={(signupValue) => signup(signupValue)}
        >
          <LoginTitle>COURSE MANAGEMENT ASSISTANT</LoginTitle>

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
              <Radio.Button value={Role.Student}>Student</Radio.Button>
              <Radio.Button value={Role.Teacher}>Teacher</Radio.Button>
              <Radio.Button value={Role.Manager}>Manager</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'please input the email',
              },
              {
                type: 'email',
                message: 'please input the correct email',
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
                message: 'please input the password',
              },
              {
                min: 4,
                max: 16,
                message: 'the password should be 4-16 characters',
              },
            ]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <StyledButton type="primary" htmlType="submit">
              Sign Up
            </StyledButton>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
