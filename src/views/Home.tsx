import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, message } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import DropDownMenu from '@/compontes/DropDownMenu/DropDownMenu';
import { startLoading, stopLoading } from '@/store/loadingSlice';
import { useDispatch } from 'react-redux';
import { getMenuRouter } from '@/utils/request/api/apiList';
import { AxiosResponse, AxiosError } from 'axios';
import { getIconComponent } from '@/utils/request/function';
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = {
  key: string;
  icon?: string;
  label: React.ReactNode;
  children?: MenuItem[];
};

interface ErrorData {
  message: string;
}

const Home: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [items, setItems] = useState<MenuItem[]>([]);

  const errorWindows = (msg: string) => {
    messageApi.open({
      type: 'error',
      content: msg,
    });
  };

  // const getMenuList = async () => {
  //   dispatch(startLoading());
  //   try {
  //     const response: AxiosResponse = await getMenuRouter();
  //     const responseData = response.data;
  //     if (responseData.code === '200') {
  //       setItems(responseData.data);
  //     } else {
  //       errorWindows(responseData.message);
  //     }
  //   } catch (error) {
  //     if (error instanceof AxiosError) {
  //       const errorData: ErrorData = error.response?.data || { message: error.message };
  //       errorWindows(errorData.message);
  //     } else {
  //       errorWindows("发生意外错误");
  //     }
  //   } finally {
  //     dispatch(stopLoading());
  //   }
  // };

  const { pathname } = location;

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {

    const getMenuList = async () => {
      dispatch(startLoading());
      try {
        const response: AxiosResponse = await getMenuRouter();
        const responseData = response.data;
        if (responseData.code === '200') {
          setItems(responseData.data);
        } else {
          errorWindows(responseData.message);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          const errorData: ErrorData = error.response?.data || { message: error.message };
          errorWindows(errorData.message);
        } else {
          errorWindows("发生意外错误");
        }
      } finally {
        dispatch(stopLoading());
      }
    };
    getMenuList();
    // 渲染前设置
    setSelectedKeys([pathname]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, dispatch]);

  useEffect(() => {
    setOpenKeys(findOpenKeys(pathname, items));
  }, [pathname, items]);

  const findOpenKeys = (pathname: string, items: MenuItem[]): string[] => {
    for (const item of items) {
      if (item.children) {
        for (const child of item.children) {
          if (child.key === pathname) {
            return [item.key];
          }
        }
      }
    }
    return [];
  };

  const changeMenu = ({ key, keyPath }: { key: React.Key; keyPath: React.Key[] }) => {
    navigate(key.toString());
    setOpenKeys([keyPath[keyPath.length - 1].toString()]);
  };

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  const onOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  const theme = {
    colorBgContainer: '#001529',
    borderRadiusLG: '5px',
    colorBody: '#FFFFFF',
    bgColor: '#E6EBE6',
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {contextHolder}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        collapsedWidth={80}
        width={200}
      >
        <div className="demo-logo-vertical" />
        <h1
          style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: 20,
            textAlign: 'center',
            margin: 15,
          }}
        >
          {collapsed ? '🐟' : '🐟后台管理'}
        </h1>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          onClick={changeMenu}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
        >
          {items.map((item) =>
            item.children && item.children.length > 0 ? (
              <Menu.SubMenu
                key={item.key}
                icon={item.icon ? getIconComponent(item.icon) : undefined}
                title={item.label}
              >
                {item.children.map((child) => (
                  <Menu.Item key={child.key}>{child.label}</Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item
                key={item.key}
                icon={item.icon ? getIconComponent(item.icon) : undefined}
              >
                {item.label}
              </Menu.Item>
            )
          )}
        </Menu>
      </Sider>
      <Layout style={{ background: theme.bgColor }}>
        <Header
          style={{
            padding: '5px',
            height: '50px',
            background: theme.colorBgContainer,
          }}
        >
          <div
            className="header-style"
            style={{ width: 'auto', position: 'absolute', right: 20, top: 0 }}
          >
            <DropDownMenu />
          </div>
        </Header>
        <Breadcrumb style={{ margin: '16px' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </Breadcrumb>
        <Content
          style={{
            margin: '0 16px',
            padding: 24,
            minHeight: 360,
            background: theme.colorBody,
            borderRadius: theme.borderRadiusLG,
            height: 'calc(100vh - 160px)',
            overflowY: 'auto'
          }}
        >
          <Outlet />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          YuziApi ©{new Date().getFullYear()} Developer Fishes_swim🐟
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Home;
