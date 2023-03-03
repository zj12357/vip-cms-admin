import introJs from 'intro.js';
import 'intro.js/introjs.css';
import { ADMIN_NAME } from '@/common/constants';
import './index.scss';

const registerIntro = () => {
    const intro = introJs();
    intro.setOptions({
        steps: [
            {
                title: '尊敬的贵宾',
                intro: `欢迎使用${ADMIN_NAME}-综合管理系统!`,
            },
            {
                title: '菜单栏',
                intro: `这里可以选择菜单项以操作对应的业务功能`,
                element: document.querySelector('.intro-step1') || undefined,
            },
            {
                title: '户口搜索',
                intro: `这里可以搜索对应的户口`,
                element: document.querySelector('.intro-step2') || undefined,
            },
            {
                title: '开工列表',
                intro: `点击这里可快速跳转到开工列表功能`,
                element: document.querySelector('.intro-step3') || undefined,
            },
            {
                title: '来电',
                intro: `点击这里可快速查看来电信息`,
                element: document.querySelector('.intro-step4') || undefined,
            },
            {
                title: '个人中心',
                intro: `点击这里操作当前登录用户`,
                element: document.querySelector('.intro-step5') || undefined,
            },
        ],
        nextLabel: '下一个', // 下一个按钮文字
        prevLabel: '上一个', // 上一个按钮文字
        doneLabel: '开始使用', // 完成按钮文字
        hidePrev: true, // 在第一步中是否隐藏上一个按钮
        exitOnOverlayClick: false, // 点击叠加层时是否退出介绍
        showStepNumbers: false, // 是否显示红色圆圈的步骤编号
        disableInteraction: true, // 是否禁用与突出显示的框内的元素的交互，就是禁止点击
        showBullets: false, // 是否显示面板指示点
        buttonClass: 'intro-btn',
        highlightClass: 'intro-highlight',
    });
    return intro;
};

export default registerIntro;
