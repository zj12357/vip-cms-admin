import axios from 'axios';
import { message } from 'antd';
import { asyncRemoveAllLocalStorage } from '@/utils/localStorage';
import _ from 'lodash';
import authToken from '@/common/token';
import protoRoot from '@/proto/proto';
import protobuf from 'protobufjs';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

// 请求体message
const PBrequest: any = protoRoot.lookup('resultmodel.Para');
// 响应体的message
const PBresponse: any = protoRoot.lookup('resultmodel.Res');

const service = axios.create({
    baseURL: '/', // url = base url + request url
    timeout: 200000,
    // withCredentials: true // send cookies when cross-domain requests
});

// Request interceptors
service.interceptors.request.use(
    (config) => {
        const userToken = authToken.getToken() || '';
        NProgress.start();
        // Add X-Access-Token header to every request, you can add other custom headers here
        if (userToken) {
            config.headers['t'] = userToken;
        }
        // 设置公共参数
        // config.params = { ...config.params };
        let data = Object.assign({}, config.data);
        config.data = new Blob(
            [PBrequest.encode(PBrequest.create(data)).finish()],
            { type: 'buffer' },
        );

        return config;
    },
    (error) => {
        Promise.reject(error);
    },
);

// Response interceptors
service.interceptors.response.use(
    (response) => {
        NProgress.done();
        // Some example codes here:
        // code == 20000: success
        // code == 50001: invalid access token
        // code == 50002: already login in other place
        // code == 50003: access token expired
        // code == 50004: invalid user (user not exist)
        // code == 50005: username or password is incorrect
        // You can change this part for your own usage.
        const res = response.data;
        if (res.code !== 10000) {
            message.error(res.msg || '请求错误');
            if (
                res.code === 50001 ||
                res.code === 50002 ||
                res.code === 50003
            ) {
                message.error(`鉴权失败，请重新登录`);

                asyncRemoveAllLocalStorage().then(() => {
                    _.delay(() => {
                        window.location.reload();
                    }, 500);
                });
            }
            return Promise.reject(new Error(res.msg || 'Error'));
        } else {
            //处理返回的数据
            const buf = protobuf.util.newBuffer(response.data);
            let res = PBresponse.decode(buf);
            let resData = PBresponse.decode(res.data.value);
            return resData;
        }
    },
    (error) => {
        if (error.response.status === 401) {
            message.error(`鉴权失败，请重新登录`);

            asyncRemoveAllLocalStorage().then(() => {
                _.delay(() => {
                    window.location.reload();
                }, 500);
            });
        }
        return Promise.reject(error);
    },
);

export const requestPost = (url: string, params: any) => {
    return service.post(url, params, {
        headers: {
            'Content-Type': 'application/octet-stream', // 这里根据后台要求进行设置的，如果没有要求应该是 application/octet-stream （二进制流）
        },
    });
};

export const requestGet = (url: string, params: any) => {
    return service.get(url, {
        data: params,
        headers: {
            'Content-Type': 'application/x-protobuf', // 这里根据后台要求进行设置的，如果没有要求应该是 application/x-protobuf （二进制流）
        },
    });
};

export default service;
