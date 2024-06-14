import React, { useState, useEffect } from 'react';
import {
  DesktopOutlined,
  PieChartOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import DropDownMenu from '@/compontes/DropDownMenu/DropDownMenu';
import { stopLoading } from '@/store/loadingSlice';
import { useDispatch } from 'react-redux';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = {
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  children?: MenuItem[];
};

const items: MenuItem[] = [
  { key: '/home', label: '首页', icon: <PieChartOutlined /> },
  { key: '/setting22', label: 'Option 2', icon: <DesktopOutlined /> },
  {
    key: '/sub1',
    label: 'User',
    icon: <UserOutlined />,
    children: [
      { key: '/setting1', label: 'Tom' },
      { key: '/4', label: 'Bill' },
      { key: '/5', label: 'Alex' },
    ],
  },
  {
    key: '/sub2',
    label: 'Team',
    icon: <TeamOutlined />,
    children: [
      { key: '/6', label: 'Team 1' },
      { key: '/7', label: 'Team 2' },
    ],
  },
  {
    key: '/setting',
    label: '设置',
    icon: <SettingOutlined />,
    children: [
      { key: '/setting12', label: '用户管理' },
      { key: '/system-settings', label: '系统设置' },
      { key: '/58', label: '页面设置' },
    ],
  },
];

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

const Home: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { pathname } = location;

  const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    setSelectedKeys([pathname]);
    setOpenKeys(findOpenKeys(pathname, items));

    const timer = setTimeout(() => {
      dispatch(stopLoading());
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname, dispatch]);

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
            item.children ? (
              <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                {item.children.map((child) => (
                  <Menu.Item key={child.key}>{child.label}</Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item key={item.key} icon={item.icon}>
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
