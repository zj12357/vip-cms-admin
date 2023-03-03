/*
 * @version:  ;
 * @description:  ;
 *
 * @date: Do not edit
 */
import 'mutationobserver-shim'; // 兼容ie8
import cssVars from 'css-vars-ponyfill'; // css var 的垫片
import { setLocalStorage } from '@/utils/localStorage';
import { ConfigProvider } from 'antd';

export const themeOptions: {
    dark: {
        [key: string]: string;
    };
    light: {
        [key: string]: string;
    };
} = {
    // 浅色
    light: {
        '--m-theme-bg-color': '#181818',
        '--m-theme-font-color': '#ffffff',
    },
    // 深色
    dark: {
        '--m-theme-bg-color': '#222222',
        '--m-theme-font-color': '#ffffff',
    },
};

export const initTheme = (theme: 'dark' | 'light') => {
    document.documentElement.setAttribute('data-theme', theme);
    cssVars({
        rootElement: document,
        silent: true,
        watch: true,
        // variables 自定义属性名/值对的集合
        variables: themeOptions[theme],
        // 当添加，删除或修改其<link>或<style>元素的禁用或href属性时，ponyfill将自行调用
        onlyLegacy: false, // false 默认将css变量编译为浏览器识别的css样式 true 当浏览器不支持css变量的时候将css变量编译为识别的css
    });
    ConfigProvider.config({
        theme: {
            primaryColor: themeOptions[theme]['--m-theme-bg-color'],
        },
    });
    setLocalStorage('mtheme', theme);
};
