import axios from 'axios';
import {getToken} from '../utils/auth'

// 创建axios实例
const service = axios.create({
    // baseURL: process.env.BASE_API, // api的base_url
    timeout: 50000, // 请求超时时间
});

// request拦截器
service.interceptors.request.use(config => {
    const token=getToken();
    if(token){
        config.headers.authorization ='Bearer '+token;
    }
    return config;
}, error => {
    Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use(
    res => {
        if(res.status === 200 || res.status === 304){
            return res.data;
        }
        else{
            console.log('网络不太给力哦，检查一下您的网络再试吧！')
        }
    },
    error => {
        if(error.response.status===403){
            if(window.confirm('token已过期，请重新登录！')){
                window.history.replaceState(null, null, '/login');
                window.location.reload();
            }else{
                console.log('cancel')
            }
        }
        console.log('err' , error.response); // for debug
        console.log('网络不太给力哦，检查一下您的网络再试吧！')
        return Promise.reject(error);    
    },
);

export default service;


