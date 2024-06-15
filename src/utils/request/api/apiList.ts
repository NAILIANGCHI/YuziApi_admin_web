import React from "react";
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


// 获取微博热搜前20
export const getWeiboHot = async () => {
    return await request({
        url: '/jx/weibo',
        method: 'get',
        data: {}
    });
}

// 获取父菜单列表
export const getMenuList = async () => {
    return await request({
        url: '/menu/getMenuList',
        method: 'get',
        data: {}
    });
}

// 更新按钮开关
export const updateMenuStatus = async (key: React.Key) => {
    return await request({
        url: `/menu/updateMenuCheck/${key}`,
        method: 'post',
        data: {} 
    });
}
