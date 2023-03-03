import type { RcFile } from 'antd/es/upload';
import Big from 'big.js';

/**
 * @description: 判断数据类型 ;
 * @param {*}
 * @return {*}
 */

export const isObject = (value: unknown): value is Record<any, any> =>
    value !== null &&
    Object.prototype.toString.call(value) === '[object Object]';

export const isFunction = (value: unknown): value is Function =>
    typeof value === 'function';

export const isString = (value: unknown): value is string =>
    typeof value === 'string';

export const isBoolean = (value: unknown): value is boolean =>
    typeof value === 'boolean';

export const isNumber = (value: unknown): value is number =>
    typeof value === 'number';

export const isUndef = (value: unknown): value is undefined =>
    typeof value === 'undefined';

export const isArray = (value: unknown): value is Array<any> =>
    value !== null &&
    Object.prototype.toString.call(value) === '[object Array]';

export function isDate(val: unknown): val is Date {
    return (
        Object.prototype.toString.call(val) === '[object Date]' &&
        !isNaN((val as Date).getTime())
    );
}

export const getType = (value: any) => {
    const match = Object.prototype.toString.call(value).match(/ (\w+)]/);
    return match?.[1].toLocaleLowerCase();
};

/**
 * @description: 判断设备 ;
 * @param {*}
 * @return {*}
 */

export const getExplorerInfo = () => {
    let t = navigator.userAgent.toLowerCase();
    return 0 <= t.indexOf('msie')
        ? {
              //ie < 11
              type: 'IE',
              version: Number(t.match(/msie ([\d]+)/)?.[1]),
          }
        : !!t.match(/trident\/.+?rv:(([\d.]+))/)
        ? {
              // ie 11
              type: 'IE',
              version: 11,
          }
        : 0 <= t.indexOf('edge')
        ? {
              type: 'Edge',
              version: Number(t.match(/edge\/([\d]+)/)?.[1]),
          }
        : 0 <= t.indexOf('firefox')
        ? {
              type: 'Firefox',
              version: Number(t.match(/firefox\/([\d]+)/)?.[1]),
          }
        : 0 <= t.indexOf('chrome')
        ? {
              type: 'Chrome',
              version: Number(t.match(/chrome\/([\d]+)/)?.[1]),
          }
        : 0 <= t.indexOf('opera')
        ? {
              type: 'Opera',
              version: Number(t.match(/opera.([\d]+)/)?.[1]),
          }
        : 0 <= t.indexOf('Safari')
        ? {
              type: 'Safari',
              version: Number(t.match(/version\/([\d]+)/)?.[1]),
          }
        : {
              type: t,
              version: -1,
          };
};

/**
 * @description: 文档高度 ;
 * @param {*}
 * @return {*}
 */

export function getDocumentTop() {
    let bodyScrollTop = document.body ? document.body.scrollTop : 0;
    let documentScrollTop = document.documentElement
        ? document.documentElement.scrollTop
        : 0;
    return bodyScrollTop - documentScrollTop > 0
        ? bodyScrollTop
        : documentScrollTop;
}

/**
 * @description: 可视窗口高度 ;
 * @param {*}
 * @return {*}
 */
export function getWindowHeight() {
    let windowHeight = 0;

    if (document.compatMode === 'CSS1Compat') {
        windowHeight = document.documentElement.clientHeight;
    } else {
        windowHeight = document.body.clientHeight;
    }
    return windowHeight;
}

/**
 * @description: 滚动条滚动高度 ;
 * @param {*}
 * @return {*}
 */
export function getScrollHeight() {
    let bodyScrollHeight = document.body ? document.body.scrollHeight : 0;
    let documentScrollHeight = document.documentElement
        ? document.documentElement.scrollHeight
        : 0;
    return bodyScrollHeight - documentScrollHeight > 0
        ? bodyScrollHeight
        : documentScrollHeight;
}

/**
 * @description: 滚动 ;
 * @param {*}
 * @return {*}
 */
export const scrollToBottom = () => {
    window.scrollTo({
        top: document.documentElement.offsetHeight,
        left: 0,
        behavior: 'smooth',
    });
};

/**
 * @Description:  深度克隆;
 * @Param:  ;
 * @Return:  ;
 */

export function isDef<T>(val: T): val is NonNullable<T> {
    return val !== undefined && val !== null;
}

export function deepClone<T extends Record<string, any> | null | undefined>(
    obj: T,
): T {
    if (!isDef(obj)) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => deepClone(item)) as unknown as T;
    }

    if (typeof obj === 'object') {
        const to = {} as Record<string, any>;
        Object.keys(obj).forEach((key) => {
            to[key] = deepClone(obj[key]);
        });

        return to as T;
    }

    return obj;
}

/**
 * @Description:  生成随机数范围;
 * @Param:  ;
 * @Return:  ;
 */
export const randomNum = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

export const randomString = (len: number) => {
    let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz123456789';
    let strLen = chars.length;
    let randomStr = '';
    for (let i = 0; i < len; i++) {
        randomStr += chars.charAt(Math.floor(Math.random() * strLen));
    }
    return randomStr;
};

/**
 * @description: class添加，删除，切换 ;
 * @param {*}
 * @return {*}
 */
// 检查元素是否有class
export const hasClass = (ele: HTMLElement, className: string) => {
    return !!ele.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

// 元素添加class
export const addClass = (ele: HTMLElement, className: string) => {
    if (!hasClass(ele, className)) ele.className += ' ' + className;
};

// 元素移除class
export const removeClass = (ele: HTMLElement, className: string) => {
    if (hasClass(ele, className)) {
        const reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
};

// 切换元素的class
export const toggleClass = (ele: HTMLElement, className: string) => {
    if (!ele || !className) {
        return;
    }
    let classString = ele.className;
    const nameIndex = classString.indexOf(className);
    if (nameIndex === -1) {
        classString += '' + className;
    } else {
        classString =
            classString.substring(0, nameIndex) +
            classString.substring(nameIndex + className.length);
    }
    ele.className = classString;
};

/**
 * @Description:  是否是手机设备;
 * @Param:  ;
 * @Return:  ;
 */

export const isMobile = () => {
    const regMobileAll =
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i;
    return regMobileAll.test(window.navigator.userAgent);
};

export const isAndroid = () => {
    return /android/i.test(navigator.userAgent.toLowerCase());
};

export const isIOS = () => {
    let reg = /iPhone|iPad|iPod|iOS|Macintosh/i;
    return reg.test(navigator.userAgent.toLowerCase());
};

/**
 * @Description: cookies ;
 * @Params:  ;
 * @Return:  ;
 */
export const setCookie = (key: string, value: any, expire: number) => {
    const d = new Date();
    d.setDate(d.getDate() + expire);
    document.cookie = `${key}=${value};expires=${d.toUTCString()}`;
};
export const getCookie = (key: string) => {
    const cookieStr = unescape(document.cookie);
    const arr = cookieStr.split('; ');
    let cookieValue = '';
    for (let i = 0; i < arr.length; i++) {
        const temp = arr[i].split('=');
        if (temp[0] === key) {
            cookieValue = temp[1];
            break;
        }
    }
    return cookieValue;
};
export const delCookie = (key: string) => {
    document.cookie = `${encodeURIComponent(key)}=;expires=${new Date()}`;
};

/**
 * @Description:  全屏;
 * @Param:  ;
 * @Return:  ;
 */

export const goToFullScreen = (element?: any) => {
    element = element || document.body;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullScreen();
    }
};

export const goExitFullscreen = () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
        ///@ts-ignore
    } else if (document.msExitFullscreen) {
        ///@ts-ignore
        document.msExitFullscreen();
        ///@ts-ignore
    } else if (document.mozCancelFullScreen) {
        ///@ts-ignore
        document.mozCancelFullScreen();
        ///@ts-ignore
    } else if (document.webkitExitFullscreen) {
        ///@ts-ignore
        document.webkitExitFullscreen();
    }
};

/**
 * @Description:  等待时间;
 * @Param:  ;
 * @Return:  ;
 */
export const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

/**
 * @Description:  antd预览图片转base64;
 * @Param:  ;
 * @Return:  ;
 */
export const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

/**
 * @Description: 隐藏中间数字 ;
 * @Params: ;
 * @Return:  ;
 */
export const hideMiddleNumber = (
    value: string | number,
    front: number = 3,
    behind: number = 4,
    stars: number = 4,
): string => {
    value = String(value);
    const length = value.length;
    return (
        value.substring(0, front) +
        '*'.repeat(stars) +
        value.substring(length - behind)
    );
};

/**
 * @Description: 处理金额，保留4位小数不四舍五入，小数结尾不能是0;
 * @Params:  ;
 * @Return:  ;
 */
export function formatCurrency(
    num: string | number,
    decimal: number = 4,
    isCalculation: boolean = true, //是否需要转换成分
) {
    let numStr = isCalculation
        ? new Big(Number(num) || 0).div(1000000).toString()
        : (num || 0).toString();

    let index = numStr.indexOf('.');
    if (index !== -1) {
        const splitList = numStr.split('.');
        numStr =
            splitList[0] +
            '.' +
            splitList[1].substring(0, decimal).replace(/0+?$/, '');
    } else {
        numStr = numStr.substring(0);
    }
    return Number(numStr);
}

export function decimal(num: number, count = 0) {
    let res = Math.pow(10, count);
    return Math.round(num * res) / res;
}

export const formatMoney = (money: string) => {
    return money
        .replace(
            new RegExp(
                `(?!^)(?=(\\d{3})+${money.includes('.') ? '\\.' : '$'})`,
                'g',
            ),
            ',',
        )
        .replace(/(\+|-),/, '$1');
};
