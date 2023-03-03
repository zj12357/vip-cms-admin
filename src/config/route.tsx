import React from 'react';
import {
    FileDoneOutlined,
    FallOutlined,
    DotChartOutlined,
    SolutionOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { RouteIfoType, RouteIfoItemType } from './type';

//配置菜单,routes父级path在权限里面配置，没有就用子级的第一个
export const menuRoute: RouteIfoType = {
    path: '/welcome',
    routes: [
        {
            path: '/account',
            name: '户口管理',
            icon: <FileDoneOutlined />,
            routes: [
                {
                    path: '/account/customer',
                    name: '客户户口',
                },
                {
                    path: '/account/company',
                    name: '公司户口',
                },
                {
                    path: '/account/companyInternalCard',
                    name: '公司内部卡',
                },
            ],
        },
        {
            path: '/admission',
            name: '入场管理',
            icon: <FallOutlined />,
            routes: [
                {
                    path: '/admission/list',
                    name: '开工列表',
                },
                {
                    path: '/admission/record',
                    name: '入场记录',
                },
            ],
        },
        {
            path: '/scene',
            name: '场面管理',
            icon: <DotChartOutlined />,
            routes: [
                {
                    path: '/scene/list',
                    name: '入场列表',
                },
                // {
                //     path: '/scene/record',
                //     name: '围数记录',
                // },
                // {
                //     path: '/scene/report',
                //     name: '围数报表',
                // },
            ],
        },
        {
            path: '/service',
            name: '服务管理',
            icon: <SolutionOutlined />,
            routes: [
                {
                    path: '/service/consumList',
                    name: '消费列表',
                },
                {
                    path: '/service/integralList',
                    name: '积分列表',
                },
                {
                    path: '/service/giftMoneyList',
                    name: '礼遇金列表',
                },
                {
                    path: '/service/consumConfig',
                    name: '消费配置',
                },
            ],
        },
        {
            path: '/silverHead',
            name: '银头管理',
            icon: <FileDoneOutlined />,
            routes: [
                {
                    path: '/silverHead/overview',
                    name: '银头概况',
                },
                {
                    path: '/silverHead/shiftRecord',
                    name: '交班记录',
                },
                {
                    path: '/silverHead/monthlyRecord',
                    name: '月结记录',
                },
                {
                    path: '/silverHead/buyRecord',
                    name: '大场买码记录',
                },
                {
                    path: '/silverHead/all',
                    name: '全部银头概览',
                },
            ],
        },
        {
            path: '/reportManagement',
            name: '报表管理',
            icon: <FileDoneOutlined />,
            routes: [
                {
                    path: '/reportManagement/market',
                    name: '市场报表',
                },
                {
                    path: '/reportManagement/accounting',
                    name: '记录管理',
                },
            ],
        },
        {
            path: '/system',
            name: '系统管理',
            icon: <SettingOutlined />,
            routes: [
                {
                    path: '/system/departmentConfig',
                    name: '部门配置',
                },
                {
                    path: '/system/accountConfig',
                    name: '账号配置',
                },
                {
                    path: '/system/menuConfig',
                    name: '菜单配置',
                },
                {
                    path: '/system/systemConfig',
                    name: '系统配置',
                },
            ],
        },
        {
            path: '/consumptionCenter',
            name: '消息中心',
            icon: <SettingOutlined />,
            routes: [
                {
                    path: '/consumptionCenter/consumerService',
                    name: '消费服务',
                },
            ],
        },
        {
            path: '/communication',
            name: '通讯管理',
            icon: <SettingOutlined />,
            routes: [
                {
                    path: '/communication/sms',
                    name: '短信管理',
                },
                {
                    path: '/communication/telephone',
                    name: '电话管理',
                },
            ],
        },
        {
            path: '/eBet',
            name: '电投管理',
            icon: <SettingOutlined />,
            routes: [
                {
                    path: '/eBet/setup',
                    name: '电投设置',
                },
            ],
        },
    ],
};

//页面里面的权限路由
export const pageRoute: RouteIfoItemType[] = [
    {
        path: '/system/systemConfig',
        name: '系统配置',
        routes: [
            {
                path: '/system/systemConfig/venueList',
                name: '场馆管理',
            },
            {
                path: '/system/systemConfig/vipList',
                name: 'VIP管理',
            },
            {
                path: '/system/systemConfig/accountTypeList',
                name: '户口类型管理',
            },
            {
                path: '/system/systemConfig/accountIdentityList',
                name: '户口身份管理',
            },
            {
                path: '/system/systemConfig/currencyList',
                name: '货币管理',
            },
            {
                path: '/system/systemConfig/exchangeRateList',
                name: '汇率管理',
            },

            {
                path: '/system/systemConfig/integralList',
                name: '积分结算配置',
            },
            {
                path: '/system/systemConfig/creditCfg',
                name: '信贷管理',
            },
        ],
    },
    {
        path: '/reportManagement/market',
        name: '市场报表',
        routes: [
            {
                path: '/reportManagement/accounting/creditLimit',
                name: '信贷额度记录',
            },
            {
                path: '/reportManagement/market/accountOpening',
                name: '开户报表',
            },
            {
                path: '/reportManagement/market/accountInformation',
                name: '户口资料报表',
            },
            {
                path: '/reportManagement/market/customer',
                name: '客户报表',
            },
            {
                path: '/reportManagement/market/finance',
                name: '存取款报表',
            },
            {
                path: '/reportManagement/market/upDown',
                name: '上下数报表',
            },
            {
                path: '/reportManagement/market/upDownDetail',
                name: '上下数明细报表',
            },
            {
                path: '/reportManagement/market/operating',
                name: '营运数报表',
            },
            {
                path: '/reportManagement/market/maker',
                name: 'M报表',
            },
            {
                path: '/reportManagement/market/transcoding',
                name: '转码报表',
            },
            {
                path: '/reportManagement/market/transcodingSearch',
                name: '转码查询报表',
            },
            {
                path: '/reportManagement/market/transcodingDetail',
                name: '转码明细报表',
            },
            {
                path: '/reportManagement/accounting/circle',
                name: '围数报表',
            },
        ],
    },
    {
        path: '/reportManagement/accounting',
        name: '记录管理',
        routes: [
            {
                path: '/reportManagement/accounting/commission',
                name: '佣金记录查询',
            },
            {
                path: '/reportManagement/accounting/creditLimit',
                name: '信贷额度记录',
            },
            {
                path: '/reportManagement/accounting/batchOperation',
                name: '批额操作记录',
            },
            {
                path: '/reportManagement/accounting/accountInquiry',
                name: '户口验证记录',
            },
            {
                path: '/reportManagement/accounting/accountRemarks',
                name: '户口备注查询',
            },
        ],
    },
    {
        path: '/silverHead/overview',
        name: '银头概况',
        routes: [
            {
                path: '/silverHead/overview/overview',
                name: '场馆管理',
            },
            {
                path: '/silverHead/overview/chipSetting',
                name: '场馆筹码配置',
            },
            {
                path: '/silverHead/overview/chipManagement',
                name: '场馆筹码管理',
            },
        ],
    },
    {
        path: '/reportManagement/accounting/commission',
        name: '佣金记录查询',
        routes: [
            {
                path: '/reportManagement/accounting/commission/transcodingRecord',
                name: '转码记录',
            },
            {
                path: '/reportManagement/accounting/commission/outgoingRecord',
                name: '即出记录',
            },
            {
                path: '/reportManagement/accounting/commission/monthlyStatement',
                name: '月结明细',
            },
        ],
    },
    {
        path: '/communication/sms',
        name: '短信管理',
        routes: [
            {
                path: '/communication/sms/services',
                name: '渠道管理',
            },
            {
                path: '/communication/sms/template',
                name: '模版管理',
            },
            {
                path: '/communication/sms/batchSend',
                name: '群发短信',
            },
            {
                path: '/communication/sms/history',
                name: '发送记录',
            },
        ],
    },
    {
        path: '/communication/telephone',
        name: '电话管理',
        routes: [
            {
                path: '/communication/telephone/callLogs',
                name: '通话记录',
            },
            {
                path: '/communication/telephone/seat',
                name: '坐席管理',
            },
        ],
    },
    {
        path: '/eBet/setup',
        name: '电投设置',
        routes: [
            {
                path: '/eBet/setup/deskOverview',
                name: '桌台即时概况',
            },
            {
                path: '/eBet/setup/gamble',
                name: '局管理',
            },
            {
                path: '/eBet/setup/betManage',
                name: '注单管理',
            },
            {
                path: '/eBet/setup/announce',
                name: '公告管理',
            },
            {
                path: '/eBet/setup/archive',
                name: '提案管理',
            },
            {
                path: '/eBet/setup/agentPhone',
                name: '代理电话配置',
            },
            {
                path: '/eBet/setup/better',
                name: '电投手管理',
            },
            {
                path: '/eBet/setup/betterReport',
                name: '电投手开工报表',
            },
            {
                path: '/eBet/setup/deskLimit',
                name: '桌台限红管理',
            },
            {
                path: '/eBet/setup/deskConfig',
                name: '桌台参数设置',
            },
            {
                path: '/eBet/setup/userLimitConfig',
                name: '用户限红参数管理',
            },
            {
                path: '/eBet/setup/commissionConfig',
                name: '转码参数管理',
            },
            {
                path: '/eBet/setup/chipConfig',
                name: '筹码参数管理',
            },
            {
                path: '/eBet/setup/baseConfig',
                name: '基础数据管理',
            },
            {
                path: '/eBet/setup/topAgentLimit',
                name: '一级代理限红配置',
            },
        ],
    },
];
