import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import '@/locales'; //国际化
import './assets/css/base.css';
import './assets/scss/global.scss';
import { Modal } from 'antd';
import _ from 'lodash';

ReactDOM.render(
    // <React.StrictMode> //antd在严格模式下会报错
    <App />,
    // </React.StrictMode>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA

serviceWorkerRegistration.unregister();

// serviceWorkerRegistration.register({
//     onSuccess: (registration, installingWorker) => {
//         console.log('registration', registration);
//         console.log('installingWorker', installingWorker);
//         console.log('PWA 安装成功!');
//     },
//     onUpdate: (registration, installingWorker) => {
//         console.log('registration', registration);
//         console.log('installingWorker', installingWorker);
//         console.log('PWA 更新成功!');
//         Modal.info({
//             title: '更新应用',
//             content: (
//                 <>
//                     <div className="m-primary-font-color">
//                         新版应用已经发布，请点击更新
//                     </div>
//                 </>
//             ),
//             maskClosable: true,
//             centered: true,
//             okText: '更新',
//             onOk: () => {
//                 installingWorker.postMessage({
//                     type: 'SKIP_WAITING',
//                 });
//                 registration.update();
//                 _.delay(() => {
//                     window.location.reload();
//                 }, 500);
//             },
//         });
//     },
// });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
