import { useNavigate } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import ParticlesBg from 'particles-bg';
import { login } from '@/utils/request/api/apiList';
import { AxiosResponse, AxiosError } from 'axios';

interface LoginFormValues {
  username: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
  code: string;
}

interface DataVerify {
  code: string;
  message: string;
  data: {
    token: string;
  };
}

interface ErrorData {
  message: string;
}

const Login = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const success = (message: string) => {
    messageApi.open({
      type: 'success',
      content: message,
    });
  };

  const errorWindows = (message: string) => {
    messageApi.open({
      type: 'error',
      content: message,
    });
  };

  // 保存登录信息
  const saveData = () => {
    navigate('/');
  };

  const onFinish = async (values: LoginFormValues) => {
    const data: LoginData = {
      email: values.username,
      password: values.password,
      code: ''
    };

    try {
      const response: AxiosResponse<DataVerify> = await login(data);
      const responseData: DataVerify = response.data;

      if (responseData.code !== '200') {
        console.log(responseData.code)
        errorWindows(responseData.message);
      } else {
        success('登录成功');
        localStorage.setItem('token', responseData.data.token);
        setTimeout(saveData, 2000);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorData: ErrorData = error.response?.data || { message: error.message };
        errorWindows(errorData.message);
      } else {
        errorWindows('An unexpected error occurred');
      }
    }
  };

  return (
    <>
      {contextHolder}
      {/* 动态背景 */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <ParticlesBg type="circle" bg={true} />
      </div>
      <div style={{ width: "100%", height: "100vh", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Form style={{ width: "300px", paddingTop: "20px" }}
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <h1 style={{fontSize: '30px', fontWeight: 'bold'}}>登录</h1>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: '请输入邮箱',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="邮箱" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
            <br />
            <a style={{ display: 'flex', justifyContent: 'right' }} href="https:///xxx">现在去注册</a>
            <hr />
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default Login;
