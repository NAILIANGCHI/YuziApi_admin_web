import React, { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "@/utils/request/function";
import { message } from "antd";

interface PrivateRouteProps {
  children: ReactNode;
  auth?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, auth = false }) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const goToLoginPage = () => {
    navigate('/login');
  };

  const errorWindows = (msg: string) => {
    messageApi.open({
      type: 'error',
      content: msg,
    });
  };

  useEffect(() => {
    if (auth && !getToken()) {
      errorWindows("操作失败，请登录！");
      setTimeout(goToLoginPage, 1000);
    }
  });

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
};

export default PrivateRoute;
