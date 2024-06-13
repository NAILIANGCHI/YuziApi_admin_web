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

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = {
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  children?: MenuItem[];
};

function getItem(
  label: React.ReactNode,
  key: string,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items: MenuItem[] = [
  getItem('Option 1', '/home', <PieChartOutlined />),
  getItem('Option 2', '/setting', <DesktopOutlined />),
  getItem('User', '/sub1', <UserOutlined />, [
    getItem('Tom', '/setting1'),
    getItem('Bill', '/4'),
    getItem('Alex', '/5'),
  ]),
  getItem('Team', '/sub2', <TeamOutlined />, [
    getItem('Team 1', '/6'),
    getItem('Team 2', '/7'),
  ]),
  getItem('系统设置', '/system-settings', <SettingOutlined />),
];

const Home: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { pathname } = location;

  const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname]);

  useEffect(() => {
    setSelectedKeys([pathname]);
  }, [pathname]);

  const changeMenu = ({ key }: { key: React.Key }) => {
    navigate(key.toString());
  };

  const theme = {
    colorBgContainer: '#001529',
    borderRadiusLG: '5px',
    colorBody: '#FFFFFF',
    bgColor: '#E6EBE6'
  };

  return (
    <Layout style={{ minHeight: '100vh'}}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        collapsedWidth={80} // 自定义侧边栏收起后的宽度
        width={200} // 自定义侧边栏展开时的宽度
      >
        <div className="demo-logo-vertical" />
        {/* 根据侧边栏的收起/展开状态，动态显示不同的标题 */}
        <h1 style={{ color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center', margin: 10 }}>
          {collapsed ? '🐟' : '🐟后台管理'}
        </h1>
        <Menu theme="dark" mode="inline" selectedKeys={selectedKeys} onClick={changeMenu} items={items} />
      </Sider>
      <Layout style={{ background: theme.bgColor }}>
        <Header style={{ padding: '5px', height: '50px', background: theme.colorBgContainer }}>
          <div className='header-style' style={{ width: 'auto', position: 'fixed', right: 20, top: 0}}>
            <DropDownMenu />
          </div>
        </Header>
        {/* 面包屑 */}
        <Breadcrumb style={{ margin: '16px' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ margin: '0 16px', padding: 24, minHeight: 360, background: theme.colorBody, borderRadius: theme.borderRadiusLG }}>
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
