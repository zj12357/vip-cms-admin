/// <reference lib="webworker" />

import { clientsClaim, skipWaiting, setCacheNameDetails } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import {
    precacheAndRoute,
    createHandlerBoundToURL,
    cleanupOutdatedCaches,
} from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { CacheFirst } from 'workbox-strategies/CacheFirst';
import { NetworkFirst } from 'workbox-strategies/NetworkFirst';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { nanoid } from 'nanoid';

declare const self: ServiceWorkerGlobalScope;

const DAY_IN_SECONDS = 24 * 60 * 60;
const MONTH_IN_SECONDS = DAY_IN_SECONDS * 30;
//pwa版本,提交commit的hash值
const VERSION = process.env.REACT_APP_COMMITHASH || nanoid();

//缓存名称
setCacheNameDetails({
    prefix: 'react-admin',
    suffix: VERSION,
    precache: 'precache',
    runtime: 'runtime',
});

//跳过等待期
skipWaiting();
//一旦激活就开始控制任何现有客户机
clientsClaim();
//删除过期缓存
cleanupOutdatedCaches();

// 预缓存功能
precacheAndRoute(self.__WB_MANIFEST);

//离线允许 html 可以访问
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(({ request, url }: { request: Request; url: URL }) => {
    if (request.mode !== 'navigate') {
        return false;
    }
    if (url.pathname.startsWith('/_')) {
        return false;
    }

    if (url.pathname.match(fileExtensionRegexp)) {
        return false;
    }

    return true;
}, createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html'));

//js css缓存,网络优先
registerRoute(
    /\.(?:js|css)$/,
    new NetworkFirst({
        cacheName: 'js-css-caches',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 1000,
                maxAgeSeconds: MONTH_IN_SECONDS,
            }),
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    }),
);

//图片缓存
registerRoute(
    /\.(?:png|jpg|jpeg|gif|bmp|webp|svg|ico)$/,
    new StaleWhileRevalidate({
        cacheName: 'images-caches',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 1000,
                maxAgeSeconds: MONTH_IN_SECONDS,
            }),
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    }),
);

//CND静态资源缓存
registerRoute(
    /^https:\/\/cdn\.jsdelivr\.net/,
    new CacheFirst({
        cacheName: 'cdn-caches',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 1000,
                maxAgeSeconds: MONTH_IN_SECONDS,
            }),
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    }),
);

//字体缓存
registerRoute(
    /\.(?:eot|ttf|woff|woff2)$/,
    new CacheFirst({
        cacheName: 'fonts-caches',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 1000,
                maxAgeSeconds: MONTH_IN_SECONDS,
            }),
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    }),
);

//api接口的缓存策略
registerRoute(
    /\/api/,
    new NetworkFirst({
        cacheName: 'api-caches',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 1000,
                maxAgeSeconds: MONTH_IN_SECONDS,
            }),
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    }),
);

//所有的页面都得到及时自动更新
self.addEventListener('install', function (event) {
    event.waitUntil(self.skipWaiting());
});

//手动更新全部页面
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
        self.clients.claim();
    }
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            // 清理旧版本
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== `react-admin-precache-${VERSION}`) {
                            return caches.delete(cacheName);
                        }
                        return cacheName;
                    }),
                );
            }),
            // 更新客户端
            self.clients.claim(),
        ]),
    );
});
