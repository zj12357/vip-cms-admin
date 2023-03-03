export const systemButton = [
    {
        path: '/system/departmentConfig',
        buttonList: [
            //部门新建
            {
                normal: 'department-add',
                name: '新建',
            },
        ],
    },
    {
        path: '/system/accountConfig',
        buttonList: [
            //账号新建
            {
                normal: 'account-add',
                name: '新建',
            },
            //账号编辑
            {
                normal: 'account-edit',
                name: '编辑',
            },
            //账号删除
            {
                normal: 'account-del',
                name: '删除',
            },
            //账号禁用(开关类型)
            {
                normal: 'account-disable',
                name: '',
            },
        ],
    },
    {
        path: '/system/systemConfig/vipList',
        buttonList: [
            //[会员等级]新建
            {
                normal: 'vip-add',
                name: '新增等级',
            },
            //[会员等级]编辑
            {
                normal: 'vip-edit',
                name: '编辑',
            },
            //[会员等级]删除
            {
                normal: 'vip-delete',
                name: '删除',
            },
        ],
    },
    {
        //[户口类型管理]
        path: '/system/systemConfig/accountTypeList',
        buttonList: [
            {
                normal: 'account-type-add',
                name: '新增',
            },
            {
                normal: 'account-type-edit',
                name: '编辑',
            },
            {
                normal: 'account-type-orate',
                name: '占成',
            },
            {
                normal: 'acount-type-prate',
                name: '佣金/积分率',
            },
        ],
    },
    {
        //[汇率管理]
        path: '/system/systemConfig/exchangeRateList',
        buttonList: [
            {
                normal: 'exchange-rate-edit',
                name: '编辑',
            },
        ],
    },
];
