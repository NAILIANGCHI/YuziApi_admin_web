import { Navigate } from "react-router-dom";
import Home from "@/views/Home";
import { Setting, Page1, Not404, Login } from "./routerElement";
import { ReactNode } from "react";
import PrivateRoute from '@/router/PrivateRoute';

interface Route {
  path: string;
  name?: string;
  element: ReactNode;
  children?: Route[];
  auth?: boolean;
}

const routers: Route[] = [
  {
    path: '/',
    element: <Navigate to="/home" />
  },
  {
    path: '/',
    element: <PrivateRoute auth={true}><Home /></PrivateRoute>,
    children: [
      {
        path: "/home",
        name: 'home',
        element: <PrivateRoute auth={true}><Page1 /></PrivateRoute>, 
        auth: true // 需要认证的路由
      },
      {
        path: "setting",
        name: 'setting',
        element: <PrivateRoute auth={true}><Setting /></PrivateRoute>, 
        auth: true 
      }
    ]
  },
  {
    path: "/login",
    name: 'login',
    element: <Login />
  },
  {
    path: "*",
    element: <PrivateRoute auth={true}> <Not404 /> </PrivateRoute>
  }
];

export default routers;
