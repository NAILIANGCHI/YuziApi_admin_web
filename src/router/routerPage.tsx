import { Navigate } from "react-router-dom"; 
import Home from "@/views/Home";
import { Setting, Page1, Not404, Login} from "./routerElement"

const routers = [
    {
        path: "/",
        element: <Navigate to="/page1" />
    },
    {
        path: "/",
        element: <Home />,
        children: [
            {
                path: "page1",
                element: <Page1 />
            },
            {
                path: "setting",
                element: <Setting />
            }
        ]
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "*",
        element: <Not404 />
    }
];

export default routers;
