import React from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import routers from '@/router/routerPage.tsx';
import { HomeOutlined } from '@ant-design/icons'; // 导入图标

type Route = {
    path: string;
    display_name: string;
    children?: Route[];
};

const findRouteName = (path: string, routes: Route[]): string | undefined => {
    for (const route of routes) {
        if (route.path === path) {
            return route.display_name;
        }
        if (route.children) {
            const childRouteName = findRouteName(path, route.children);
            if (childRouteName) {
                return childRouteName;
            }
        }
    }
    return undefined;
};

const Breadcrumbs: React.FC = () => {
    const { pathname } = useLocation(); // 只获取 pathname

    // 分割当前路径
    const pathSnippets = pathname.split('/').filter(i => i);

    // 生成面包屑链接和名称
    const breadcrumbItems = pathSnippets.map((path, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`; // 构建当前层级的链接

        // 查找路由中对应的 display_name
        const displayName = findRouteName(url, routers);

        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>
                    {displayName || path} {/* 如果找不到 display_name，默认展示路径部分 */}
                </Link>
            </Breadcrumb.Item>
        );
    });

    return (
        <Breadcrumb style={{margin: '16px'}}>
            <Breadcrumb.Item>
                <Link to="/">
                    <HomeOutlined />
                </Link>
            </Breadcrumb.Item>
            {breadcrumbItems}
        </Breadcrumb>
    );
};

export default Breadcrumbs;
