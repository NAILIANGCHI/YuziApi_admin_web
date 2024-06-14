import { Navigate } from "react-router-dom";
import Home from "@/views/Home";
import { BaseSetting, Page1, Not404, Login } from "./routerElement";
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
    element: <PrivateRoute auth={true}><Home/></PrivateRoute>,
    children: [
      {
        path: "/home",
        name: 'home',
        element: <PrivateRoute auth={true}><Page1 /></PrivateRoute>, 
        auth: true
      },
      {
        path: "/system-settings",
        name: 'baseSetting',
        element: <PrivateRoute auth={true}><BaseSetting /></PrivateRoute>, 
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
