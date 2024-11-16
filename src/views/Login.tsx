import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '@/utils/request/api/apiList';
import { AxiosResponse, AxiosError } from 'axios';
import { startLoading, stopLoading } from '@/store/loadingSlice';
import "@/utils/style/login.css";
import {useDispatch} from "react-redux";

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

const Login = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleSuccess = (msg: string) => {
    messageApi.success(msg);
  };

  const handleError = (msg: string) => {
    messageApi.error(msg);
  };

  const saveDataAndRedirect = () => {
    navigate('/');
  };

  const onFinish = async (values: LoginFormValues) => {
    dispatch(startLoading())
    const data: LoginData = {
      email: values.username,
      password: values.password,
      code: "",
    };
    try {
      const response: AxiosResponse<DataVerify> = await login(data);
      const { code, message: responseMessage, data: responseData } = response.data;

      if (code !== '200') {
        dispatch(stopLoading())
        handleError(responseMessage);
      } else {
        dispatch(stopLoading())
        handleSuccess('登录成功');
        localStorage.setItem('token', responseData.token);
        setTimeout(saveDataAndRedirect, 2000);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        dispatch(stopLoading())
        const errorMsg = error.response?.data?.message || error.message;
        handleError(errorMsg);
      } else {
        dispatch(stopLoading())
        handleError('发生未知错误');
      }
    }
  };

  return (
      <>
        {contextHolder}
        <div className="site">
          <div className="container">
            <div className="login">
              <div className="hero">
                <h1>🐟<br />鱼子Api管理后台系统</h1>
                <p>如果你没有账号<br />可以<a href="#">点击这里</a>进行注册.</p>
              </div>
              <div className="main">
                <div className="form-container">
                  <h1 className={"title"}>登录</h1>
                  <Form
                      name="login"
                      onFinish={onFinish}
                      autoComplete="off"
                      layout="vertical"
                  >
                    <div className="form-fields">
                      <Form.Item
                          name="username"
                          rules={[{ required: true, message: '请输入邮箱!' }]}
                      >
                        <Input
                            placeholder="邮箱"
                            prefix={<UserOutlined />}
                        />
                      </Form.Item>
                      <Form.Item
                          name="password"
                          rules={[{ required: true, message: '请输入密码!' }]}
                      >
                        <Input.Password
                            placeholder="密码"
                            prefix={<LockOutlined />}
                        />
                      </Form.Item>
                    </div>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" block>
                        登录
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  );
};

export default Login;
