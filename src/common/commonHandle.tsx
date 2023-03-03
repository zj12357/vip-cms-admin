import React from 'react';
import cryptoJS from 'crypto-js';
import { isString, isNumber, isArray } from '@/utils/tools';
import { MenuListItem } from '@/types/api/system';
import _ from 'lodash';
import { IconFont } from '@/config/icon';
import * as XLSX from 'xlsx';

//处理标签颜色
export const handleTagClor = (value: string) => {
    const tagList = [
        {
            name: 'magenta',
            color: 'magenta',
        },
        {
            name: 'red',
            color: 'red',
        },
        {
            name: 'volcano',
            color: 'volcano',
        },
        {
            name: 'orange',
            color: 'orange',
        },

        {
            name: 'lime',
            color: 'lime',
        },
        {
            name: 'green',
            color: 'green',
        },

        {
            name: 'cyan',
            color: 'cyan',
        },
        {
            name: 'blue',
            color: 'blue',
        },
        {
            name: 'geekblue',
            color: 'geekblue',
        },
        {
            name: 'purple',
            color: 'purple',
        },
    ];
    const lastNumer = +value.charAt(
        value.length - 1 < 0 ? 0 : value.length - 1,
    );
    return tagList[lastNumer].color;
};

//查找当前路由下的按钮
export function findMenuButton(
    arr: MenuListItem[],
    pathname: string,
    pathField: string,
    childrenField: string,
): any {
    let result: any[] = [];
    const findDeep = (
        arr: MenuListItem[],
        pathname: string,
        pathField: string,
        childrenField: string,
    ) => {
        arr.forEach((value: any) => {
            if (
                pathname.includes(value?.[pathField]) &&
                value?.menu_type === 'B'
            ) {
                result.push({
                    normal: value?.normal ?? '',
                    menu_name: value?.menu_name ?? '',
                    opcode: value?.opcode ?? 1,
                    menu_id: value?.menu_id,
                });
                return;
            }
            if (isArray(value[childrenField]) && value[childrenField]?.length) {
                findDeep(
                    value[childrenField],
                    pathname,
                    pathField,
                    childrenField,
                );
            }
        });
    };
    findDeep(arr, pathname, pathField, childrenField);

    return result;
}

//过滤导航菜单
export const findMenuType = (
    arr: any[],
    menuList: any[],
    type: string,
    childrenField: string,
) => {
    //导航菜单字段映射
    const mapTree = (menu: any) => {
        return {
            path: menu.path,
            name: menu.menu_name,
            icon: <IconFont type={menu.icon}></IconFont>,
            routes: menu[childrenField].map((v: any) => mapTree(v)),
        };
    };

    for (let item of arr) {
        //不是左边导航，或者是按钮的排除
        if (item?.menu_location !== type || item?.menu_type === 'B') continue;
        let obj = {
            ...item,
            [childrenField]: [],
        };
        menuList.push(obj);
        if (item[childrenField] && item[childrenField].length)
            findMenuType(
                item[childrenField],
                obj[childrenField],
                type,
                childrenField,
            );
    }
    return {
        path: '/welcome',
        routes: (menuList?.[0]?.[childrenField] ?? []).map((item: any) =>
            mapTree(item),
        ),
    };
};

//过滤页面内菜单
export const findPageType = (
    arr: any[],
    path: string,
    childrenField: string,
    needChildren?: boolean,
) => {
    let result: any[] = [];
    const findDeep = (
        arr: MenuListItem[],
        path: string,
        childrenField: string,
    ) => {
        arr.forEach((value: any) => {
            if (value.path?.includes(path)) {
                result = (value[childrenField] ?? [])
                    ?.filter((v: MenuListItem) => v?.menu_location === 'I')
                    ?.map((i: MenuListItem) => {
                        return {
                            path: i.path,
                            name: i.menu_name,
                            icon: i.icon,
                            children: needChildren ? i.children : undefined,
                        };
                    });
                return;
            }
            if (isArray(value[childrenField]) && value[childrenField]?.length) {
                findDeep(value[childrenField], path, childrenField);
            }
        });
    };
    findDeep(arr, path, childrenField);

    return result;
};

//获取全部菜单
export const findAllRoute: (arr: any[], childrenField: string) => string[] = (
    arr: any[],
    childrenField: string,
): string[] => {
    return arr.reduce((res: string[], next: any) => {
        //排除按钮
        if (next?.menu_type !== 'B') {
            res = res.concat(next.path ?? '');
        }
        if (Array.isArray(next[childrenField])) {
            res = res.concat(findAllRoute(next[childrenField], childrenField));
        }
        return res;
    }, []);
};

//AES-CBC加密模式
//加密
export const cryptoEncrypt = (text: string, key: string) =>
    cryptoJS.AES.encrypt(text, cryptoJS.enc.Utf8.parse(key), {
        iv: cryptoJS.enc.Utf8.parse(key),
        mode: cryptoJS.mode.CBC, // CBC算法
        padding: cryptoJS.pad.Pkcs7, //使用pkcs7
    }).toString();

//解密
export const cryptoDecrypt = (text: string, key: string) =>
    cryptoJS.AES.decrypt(text, cryptoJS.enc.Utf8.parse(key), {
        iv: cryptoJS.enc.Utf8.parse(key),
        mode: cryptoJS.mode.CBC, // CBC算法
        padding: cryptoJS.pad.Pkcs7, //使用pkcs7
    }).toString(cryptoJS.enc.Utf8);

//表单项字段为空，返回undefined,主要是select，date,引用类型结构等组件
export const checkFormItemValue = (
    val: string | number | any[] | undefined,
): any => {
    if (isString(val)) {
        return !!val ? val : undefined;
    } else if (isNumber(val)) {
        return val > 0 ? val : undefined;
    } else if (isArray(val)) {
        return val.length > 0 ? val : undefined;
    } else {
        return !!val ? val : undefined;
    }
};

//导出excel
export const exportExcel = (columns: any[], id: string, excelName: string) => {
    // 获取表格的Dom对象
    const elt = document.getElementById(id);

    const wb = XLSX.utils.table_to_book(elt, {
        sheet: 'Sheet',
        raw: true,
    });
    wb.Sheets['Sheet']['!cols'] = [
        ...columns
            .filter((v) => !v?.hideInTable)
            .map((item) => {
                return {
                    hidden: !item?.dataIndex,
                    width: 15,
                };
            }),
    ];

    return XLSX.writeFile(wb, `${excelName}.xlsx`);
};
