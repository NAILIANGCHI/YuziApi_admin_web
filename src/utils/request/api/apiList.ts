import http from "./axios";

const {request} = http

// 获取用户详细信息
export const userInfo = async () => {
    return await request({
        url: '/activity/userinfo',
        method: 'post'
    });
}


// 用户登录接口
export const login = async (data: any) => {
    return await request({
        url: '/user/login',
        method: 'post',
        data: {
            ...data
        }
    });
}

// 新增菜单接口
export const addMenu = async (data: any) => {
    return await request({
        url: '/menu/add',
        method: 'post',
        data: {
            ...data
        }
    });
}
