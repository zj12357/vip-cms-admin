import { Workbox, messageSW } from 'workbox-window';

function createUIPrompt(options: any) {
    if (window.confirm(`新版应用已经发布，请点击更新`)) {
        options.onAccept();
    }
}

export default function () {
    let registration: any;
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
        const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
        const wb = new Workbox(swUrl);

        const showSkipWaitingPrompt = () => {
            createUIPrompt({
                onAccept: () => {
                    wb.addEventListener('controlling', () => {
                        window.location.reload();
                    });

                    messageSW(registration.waiting, { type: 'SKIP_WAITING' });
                },
            });
        };
        wb.addEventListener('installed', (event) => {
            if (event.isUpdate) {
                showSkipWaitingPrompt();
            }
        });

        wb.addEventListener('waiting', showSkipWaitingPrompt);
        wb.addEventListener('externalwaiting', showSkipWaitingPrompt);
        wb.register().then((r) => (registration = r));
    }
}

// 缓存优先，后退到网络
// self.addEventListener('fetch', (event) => {
//     event.respondWith(
//         caches.open(`react-admin-precache-${VERSION}`).then((cache) => {
//             return cache
//                 .match(event.request)
//                 .then((cacheResponse) => {
//                     //有缓存优先使用缓存数据，否则使用网络请求的数据
//                     if (cacheResponse) {
//                         return cacheResponse;
//                     }
//                     return fetch(event.request)
//                         .then((netResponse) => {
//                             return netResponse;
//                         })
//                         .catch((error) => {
//                             console.error('请求失败', error);
//                             throw new Error('请求失败');
//                         });
//                 })
//                 .catch(() => {
//                     return fetch(event.request);
//                 });
//         }),
//     );
// });

//网络优先，回退到缓存
// self.addEventListener('fetch', (event) => {
//     return event.respondWith(
//         caches.open(`react-admin-precache-${VERSION}`).then((cache) => {
//             return fetch(event.request)
//                 .then((netResponse) => {
//                     cache.put(event.request, netResponse.clone());
//                     return netResponse;
//                 })
//                 .catch((error) => {
//                     console.error('请求失败,使用缓存数据', error);
//                     return cache.match(event.request) as any;
//                 });
//         }),
//     );
// });
