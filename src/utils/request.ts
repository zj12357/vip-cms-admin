import axios from 'axios';
import { message } from 'antd';
import { asyncRemoveAllLocalStorage } from '@/utils/localStorage';
import authToken from '@/common/token';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import _ from 'lodash';
import { cryptoEncrypt, cryptoDecrypt } from '@/common/commonHandle';
import { API_AES_KEY } from '@/common/constants';

NProgress.configure({ showSpinner: false });

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

        //加密patch,post

        // if (config.data) {
        //     config.data = cryptoEncrypt(
        //         JSON.stringify(config.data),
        //         API_AES_KEY,
        //     );
        // }

        //加密get
        // if (config.params) {
        //     config.params = cryptoEncrypt(
        //         JSON.stringify(config.params),
        //         API_AES_KEY,
        //     );
        // }

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
        //     Success     = 10000  "请求成功",
        //     SystemErr   = 10001  "系统内部错误",
        //     MethodErr   = 10010  "方法错误",
        //     ParamErr    = 10011  "参数错误",
        //     LessParam   = 10012  "缺少参数",
        //     TokenErr    = 10020  鉴权错误",
        //     TokenEmpty  = 10021  "空鉴权",
        //     TokenExpire = 10022  "坏鉴权",
        //     NeedOPC     = 10030  "需要输入操作码",
        //     OPCErr      = 10031  "操作码错误",

        //  解密响应
        //return JSON.parse(
        //     JSON.stringify(cryptoDecrypt(response.data, API_AES_KEY)),
        // )

        const res = response.data;
        if (res.code === undefined) {
            return response.data;
        }
        if (res.code !== 10000) {
            message.error(res.msg || '请求错误');
            if ([10020, 10021, 10022].includes(res.code)) {
                message.error(`鉴权失败，请重新登录`);

                asyncRemoveAllLocalStorage().then(() => {
                    _.delay(() => {
                        window.location.reload();
                    }, 500);
                });
            }
            return Promise.reject(new Error(res.msg || 'Error'));
        } else {
            return response.data;
        }
    },
    (error) => {
        if (
            error.response.status === 401 ||
            [10020, 10021, 10022].includes(error.response.data.code)
        ) {
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

export default service;
