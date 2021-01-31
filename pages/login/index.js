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

const { Title } = Typography;

const StyledButton = styled(Button)`
  width: 100%;
`;

const LoginTitle = styled(Title)`
  text-align: center;
`;

export default function Login() {
  const [form] = Form.useForm();
  const router = useRouter();

  const login = async (loginValues) => {
    const { data } = await apiService.login(loginValues);
    console.log(data);
    if (!!data) {
      storage.setUserInfo(data);
      router.push(`/dashboard/${data.role}`);
    }
  };

  return (
    <Row justify="center" style={{ margin: '5%' }}>
      <Col>
        <Form
          name="login"
          initialValue={{
            remember: true,
            role: 'student',
          }}
          form={form}
          onFinish={(loginValues) => login(loginValues)}
        >
          <LoginTitle>COURSE MANAGEMENT ASSISTANT</LoginTitle>

          <Form.Item
            name="role"
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
              Login
            </StyledButton>
            or <Link href={'/signup'}>Sign Up</Link>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
