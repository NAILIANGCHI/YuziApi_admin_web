import React, { useState } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Option 1', '/page1', <PieChartOutlined />),
  getItem('Option 2', 'setting', <DesktopOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', 'setting1'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '7')]),
  getItem('Files', '9', <FileOutlined />),
];


export default function Home() {

  const [collapsed, setCollapsed] = useState(false);
  const navgateTo = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const changeMenu = (e: {key:string}) => {
    console.log("点击了", e.key)
    navgateTo(e.key)
    
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
    <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <div className="demo-logo-vertical" />
      <h1 style={{color: 'white', fontWeight: 'bold', fontSize: 20, textAlign: 'center', margin: 10}}>🐟后台管理</h1>
      <Menu theme="dark" defaultSelectedKeys={['/page1']} mode="inline" items={items} onClick={changeMenu}/>
    </Sider>
    <Layout>
      <Header style={{ padding: '5px 0 0 10px', background: colorBgContainer, margin: '10px 0 10px 15px', borderRadius: borderRadiusLG }} > 
      <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>User</Breadcrumb.Item>
          <Breadcrumb.Item>Bill</Breadcrumb.Item>
        </Breadcrumb>
      </Header>
      <Content style={{ margin: '0 16px', padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: borderRadiusLG }} >
        {/* 窗口部分 */}
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        YuziApi ©{new Date().getFullYear()} Developer Fishes_swim🐟
      </Footer>
    </Layout>
  </Layout>
);
}
