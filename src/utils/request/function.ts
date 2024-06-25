import React from "react";
import * as Icons from '@ant-design/icons'

//获取token
export function getToken() {
    return localStorage.getItem('token')
}

// 存入token
export function setToken(token: string) {
    localStorage.setItem('token', token)
}

// 删除 token
export function removeToken() {
    // localStorage.setItem('token', '')
    localStorage.removeItem('token')
}

// 获取图标
export const getIconComponent = (iconName: string): React.ReactNode => {
    const IconComponent = (Icons as any)[iconName as keyof typeof Icons];
    if (IconComponent) {
      return React.createElement(IconComponent);
    }
    return null;
  };