import { Navigate } from "react-router-dom";
import Home from "@/views/Home";
import {BaseSetting, Homepage, Not404, Login, ChildrenMenu, Logistics, Quotation} from "./routerElement";
import { ReactNode } from "react";
import PrivateRoute from '@/router/PrivateRoute';

interface Route {
  path: string;
  name?: string;
  display_name: string;
  element: ReactNode;
  children?: Route[];
  auth?: boolean;
}

const routers: Route[] = [
  {
    path: '/',
    display_name: '首页',
    element: <Navigate to="/home" /> // 修改重定向路径
  },
  {
    path: '/', // 添加 admin 前缀
    display_name: 'Admin 首页',
    element: <PrivateRoute auth={true}><Home /></PrivateRoute>,
    children: [
      {
        path: "/home", // 仅使用相对路径
        name: 'home',
        display_name: '首页',
        element: <PrivateRoute auth={true}><Homepage /></PrivateRoute>,
        auth: true
      },
      {
        path: "/children-menu/:id", // 仅使用相对路径
        name: 'childrenMenu',
        display_name: '子菜单',
        element: <PrivateRoute auth={true}><ChildrenMenu /></PrivateRoute>
      },
      {
        path: "/system-settings", // 仅使用相对路径
        name: 'baseSetting',
        display_name: '系统设置',
        element: <PrivateRoute auth={true}><BaseSetting /></PrivateRoute>,
        auth: true
      },
      {
        path: "/logistics", // 仅使用相对路径
        name: 'logistics',
        display_name: '头程发货记录',
        element: <PrivateRoute auth={true}><Logistics /></PrivateRoute>,
        auth: true
      },
      {
        path: "/quotation", // 仅使用相对路径
        name: 'quotation',
        display_name: '报价单制作',
        element: <PrivateRoute auth={true}><Quotation /></PrivateRoute>,
        auth: true
      },
    ]
  },
  {
    path: "/login",
    name: 'login',
    display_name: '登录',
    element: <Login />
  },
  {
    path: "*",
    display_name: '未知页面',
    element: <PrivateRoute auth={true}><Not404 /></PrivateRoute>
  }
];

export default routers;
