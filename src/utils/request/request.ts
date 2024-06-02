import axios from "axios"

// 配置统一请求地址
const baseUrl = axios.create({
    baseURL: 'http://127.0.0.1:9081/api', 
    timeout: 5000,
    headers: {
        token: localStorage.getItem("token")
    }
});

// 添加请求拦截器
baseUrl.interceptors.request.use(
    (config) => {
        // 再请求之前做什么 
        // 
        return config;
    },

// 添加请求拦截器
    (config) => {
        // 对请求错误做什么
    
        return Promise.reject(config)
    }
);

// 添加响应拦截器
baseUrl.interceptors.response.use(
    (response) => {
        // console.log(response)
      // 对响应数据做些什么
      return response.data;
    },
    (error) => {
      // 对响应错误做些什么
      return Promise.reject(error);
    }
  );
  
  export default baseUrl;


