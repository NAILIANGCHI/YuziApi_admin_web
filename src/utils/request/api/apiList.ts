import React from "react";
import http from "./axios";
import axios, { AxiosResponse, AxiosError } from 'axios';


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
        url: `/menu/update/MenuCheck/${key}`,
        method: 'post',
        data: {} 
    });
}

// 删除菜单通过id
export const delMenuItem = async (id: React.Key) => {
    return await request({
        url: `/menu/delMenu/${id}`,
        method: 'post',
        data: {} 
    })
}

// 获取子菜单列表
export const requestChildrenMenuList = async (id: React.Key) => {
    return await request({
        url: `menu/getChildrenMenuList/${id}`,
        method: 'post',
        data: {}
    })
}

// 更新子菜单开关
export const updateChaildrenMenuStatus = async (id: React.Key) => {
    return await request({
        url: `menu/update/childrenMenuCheck/${id}`,
        method: 'post',
        data: {}
    })
}

// 删除子菜单
export const delChaildrenMenuStatus = async (id: React.Key) => {
    return await request({
        url: `menu/delChildrenMenu/${id}`,
        method: 'post',
        data: {}
    })
}

// 添加子菜单
export const addchildrenMenu = async (data: any) => {
    return await request({
        url: `menu/children/addMenu`,
        method: 'post',
        data: data
    })
}

// 获取路由菜单
export const getMenuRouter = async () => {
    return await request({
        url: `menu/router`,
        method: 'get',
        data: {}
    })
}

// 通用的 GET 请求函数
export const httpGetRequest = async (url: string, params?: any): Promise<AxiosResponse> => {
    try {
        const response = await axios.get(url, { params });
        return response;
    } catch (error) {
        if (error instanceof AxiosError) {
            throw error.response?.data || { message: error.message };
        } else {
            throw { message: '发生意外错误' };
        }
    }
};

// 获取全部的物流记录
export const getWpsAllData = async (p: { pageSize: number; page: number}) => {
    return await request({
        url: `wps/all`,
        method: 'get',
        params: {  // 使用 params 传递分页参数
            page: p.page,
            pageSize: p.pageSize
        }
    });
}

// 导出账单
export const exportCheck = async (data: any) => {
    return await request({
        url: 'wps/check',
        method: 'post',
        data: {
            customerCode: data.customerCode,
            warehousingNumber: data.warehousingNumber,
            skuTotalCount: data.skuTotalCount,
            originalWeightAfterWrapping: data.originalWeightAfterWrapping,
            customerUnitPrice: data.customerUnitPrice,
            customerFreight: data.customerFreight,
            customerShelvingFee: data.customerShelvingFee,
            customerMiscellaneousFees: data.customerMiscellaneousFees,
            insuranceFee: data.insuranceFee,
            goodCostGet: data.goodCostGet,
            remarks: data.remarks,
            customerInitialBillingTotal: data.customerInitialBillingTotal,
            principal: data.principal
        }
    });
}
//