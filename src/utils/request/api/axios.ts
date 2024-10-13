import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken } from '../function';

const baseUrl = "http://127.0.0.1:9081/api";
// const baseUrl = "http://112.124.65.228:9081/api";


// 定义 RequestOptions 接口
interface RequestOptions extends AxiosRequestConfig {
    headers?: Record<string, string>;
}

// axios 二次封装
const HttpRequest = (baseUrl: string) => {
    const getInsideConfig = (): RequestOptions => {
        const token = getToken();
        const headers: Record<string, string> = {};

        if (token) {
            headers.token = token;
        }

        const config: RequestOptions = {
            baseURL: baseUrl,
            headers: headers,
        };
        return config;
    };

    const interception = (instance: AxiosInstance) => {
        // 添加请求拦截器
        instance.interceptors.request.use(function (config) {
            return config;
        }, function (error) {
            // 对请求错误做些什么
            return Promise.reject(error);
        });

        // 添加响应拦截器
        instance.interceptors.response.use(function (response: AxiosResponse) {
            // 2xx 范围内的状态码都会触发该函数。
            // 对响应数据做点什么
            return response;
        }, function (error) {
            // 对响应错误做点什么
            return Promise.reject(error);
        });
    };

    const request = (options: RequestOptions) => {
        options = { ...getInsideConfig(), ...options };
        // 创建 axios 实例
        const instance = axios.create(options);
        // 实例拦截器的定义
        interception(instance);
        // 返回一个 Promise 对象
        return instance.request(options);
    };

    return { request };
};

export default HttpRequest(baseUrl);
