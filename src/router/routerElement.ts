import { lazy } from 'react'; 

 
/*导出组件 */
export const About = lazy(() => import("@/views/About"));
export const BaseSetting = lazy(() => import("@/compontes/BaseSetting/BaseSetting"))
export const Not404 = lazy(() => import("@/compontes/NotFound"))
export const Homepage = lazy(() => import("@/views/Homepage"))
export const Login = lazy(() => import("@/views/Login"))
export const ChildrenMenu = lazy(() => import("@/views/ChildrenMenu"))
export const Logistics = lazy(() => import("@/views/Logistics.tsx"))
export const ModelPop = lazy(() => import("@/compontes/ModelPop/ModelPop.tsx"))
export const Quotation = lazy(() => import("@/views/Quotation.tsx"))


