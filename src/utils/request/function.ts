

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
    localStorage.removeItem
}