import { lazy } from 'react'; 

 
/*导出组件 */
export const About = lazy(() => import("@/views/About"));
export const Setting = lazy(() => import("@/views/Setting"))
export const Not404 = lazy(() => import("@/compontes/NotFound/index"))
export const Page1 = lazy(() => import("@/views/Page1"))
export const Login = lazy(() => import("@/views/Login"))

