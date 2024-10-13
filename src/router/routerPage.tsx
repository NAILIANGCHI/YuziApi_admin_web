import { Navigate } from "react-router-dom";
import Home from "@/views/Home";
import {BaseSetting, Homepage, Not404, Login, ChildrenMenu, Logistics} from "./routerElement";
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
    element: <Navigate to="/home" />
  },
  {
    path: '/',
    display_name: '首页',
    element: <PrivateRoute auth={true}><Home/></PrivateRoute>,
    children: [
      {
        path: "/home",
        name: 'home',
        display_name: '首页',
        element: <PrivateRoute auth={true}><Homepage /></PrivateRoute>, 
        auth: true
      },
      {
        path: "/children-menu/:id",
        name: 'childrenMenu',
        display_name: '子菜单',
        element: <PrivateRoute auth={true}><ChildrenMenu /></PrivateRoute>
      },
      {
        path: "/system-settings",
        name: 'baseSetting',
        display_name: '系统设置',
        element: <PrivateRoute auth={true}><BaseSetting /></PrivateRoute>,
        auth: true
      },
      {
        path: "/logistics",
        name: 'logistics',
        display_name: '头程发货记录',
        element: <PrivateRoute auth={true}><Logistics /></PrivateRoute>,
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
    element: <PrivateRoute auth={true}> <Not404 /> </PrivateRoute>
  }
];

export default routers;
