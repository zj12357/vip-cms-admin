import { SelectProps } from 'antd';

export const certificateType = [
    {
        label: '护照',
        value: 1,
    },
    {
        label: '大陆身份证',
        value: 2,
    },
    {
        label: '9G工签卡',
        value: 3,
    },
    {
        label: '劳工卡',
        value: 4,
    },
    {
        label: '驾驶证',
        value: 5,
    },
    {
        label: '身份证',
        value: 6,
    },
    {
        label: '其他',
        value: 7,
    },
];

export const startType: Record<number, string> = {
    1: '普通',
    2: '营运',
};

//本金类型
export const shareType = [
    { label: 'C', value: 'C' },
    { label: 'M', value: 'M' },
];
//出码类型
export const principalType = [
    { label: 'A', value: 'A' },
    { label: 'B', value: 'B' },
];

export const admissionType = [
    {
        label: '现场',
        value: 1,
    },
    {
        label: '电投',
        value: 2,
    },
];

export const workType = [
    {
        label: '普通',
        value: 1,
    },
    {
        label: '营运',
        value: 2,
    },
];
// 暂存类型
export const covertTypes = [
    {
        label: '暂存',
        value: 7,
    },
    {
        label: '取暂存',
        value: 8,
    },
];
// 转码类型
export const chipType = [
    {
        label: '开工',
        value: 1,
    },
    {
        label: '转码',
        value: 2,
    },
    {
        label: '加彩',
        value: 3,
    },
    {
        label: '回码',
        value: 4,
    },
    {
        label: '公水',
        value: 5,
    },
    {
        label: '荷水',
        value: 6,
    },
    {
        label: '暂存',
        value: 7,
    },
    {
        label: '取暂存',
        value: 8,
    },
    {
        label: '收工',
        value: 9,
    },
    {
        label: '开工台底',
        value: 10,
    },
    {
        label: '加彩台底',
        value: 11,
    },
    {
        label: '回码台底',
        value: 12,
    },
    {
        label: '收工台底',
        value: 13,
    },
    {
        label: '转码台底',
        value: 14,
    },
];
// 资金类型
export const fundsTypes = [
    {
        label: '开工',
        value: 1,
    },
    {
        label: '加彩',
        value: 3,
    },
    {
        label: '回码',
        value: 4,
    },
    {
        label: '收工',
        value: 9,
    },
    {
        label: '开工台底',
        value: 10,
    },
    {
        label: '加彩台底',
        value: 11,
    },
    {
        label: '回码台底',
        value: 12,
    },
    {
        label: '收工台底',
        value: 13,
    },
];

//积分结算配置
export const currencyIntegralType = [
    {
        label: '月结',
        value: 1,
    },
    {
        label: '实时结算',
        value: 2,
    },
    {
        label: '无积分',
        value: 3,
    },
];
// 账房状态
export const accountStatus = [
    {
        label: '空白',
        value: 1,
    },
    {
        label: '在场',
        value: 2,
    },
    {
        label: '离场',
        value: 3,
    },
];
// 场面状态
export const sceneStatus = [
    {
        label: '入场',
        value: 1,
    },
    {
        label: '在场',
        value: 2,
    },
    {
        label: '离场',
        value: 3,
    },
];

//存卡人权限
export const authorizePermissionType = [
    {
        label: '存卡',
        value: 1,
    },
    {
        label: '佣金',
        value: 2,
    },
    {
        label: '订务',
        value: 3,
    },
    {
        label: '借贷',
        value: 4,
    },
    {
        label: '查数',
        value: 5,
    },
];

// 公告类型
export const announceTypes = [
    {
        value: '2',
        label: '公告栏',
    },
    {
        value: '1',
        label: '跑马灯',
    },
    {
        value: '3',
        label: '代理系统',
    },
];

// 游戏类型
export const gameMods = [
    {
        value: 1,
        label: '快速投',
    },
    {
        value: 2,
        label: '传统',
    },
    {
        value: 3,
        label: '包桌',
    },
];

// 游戏玩法
export const gameTypes = [
    {
        value: 1,
        label: '庄',
    },
    {
        value: 2,
        label: '闲',
    },
    {
        value: 3,
        label: '和',
    },
    {
        value: 4,
        label: '庄对',
    },
    {
        value: 5,
        label: '闲对',
    },
];

// 结算状态
export const settleStatus = [
    {
        value: 1,
        label: '已结算',
    },
    {
        value: 2,
        label: '未结算',
    },
];

// 扑克牌
const hs = [
    {
        value: 'fk',
        label: '方块',
    },
    {
        value: 'mh',
        label: '梅花',
    },
    {
        value: 'hx',
        label: '红桃',
    },
    {
        value: 'ht',
        label: '黑桃',
    },
]; // 花色
const ds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']; // 点数
export const poker = ds.reduce((result: SelectProps['options'], d) => {
    const items = hs.map((h) => ({
        value: h.value + d,
        label: `${h.label}-${d}`,
    }));
    return [...(result || []), ...items];
}, []);

export const betTypes = [
    {
        value: 1,
        label: '庄/闲',
    },
    {
        value: 2,
        label: '和',
    },
    {
        value: 3,
        label: '对子',
    },
];

// 桌台状态
export const deskStatus = [
    {
        value: 1,
        label: '禁用',
    },
    {
        value: 2,
        label: '游戏中',
    },
    {
        value: 3,
        label: '维护',
    },
    {
        value: 4,
        label: '换靴',
    },
];

export const gamingResult = [
    {
        value: 0,
        label: '-',
    },
    {
        value: 1,
        label: '庄赢',
    },
    {
        value: 2,
        label: '闲赢',
    },
    {
        value: 3,
        label: '和',
    },
];

//户口联系方式-语言类型
export const phoneLanguageType = [
    {
        label: '中文',
        value: 1,
    },
    {
        label: '英文',
        value: 2,
    },
    {
        label: '韩文',
        value: 3,
    },
];
//户口联系方式-功能
export const phoneMethodType = [
    {
        label: '允许短信',
        value: 1,
    },
    {
        label: '允许呼叫',
        value: 2,
    },
];
// 订单状态
export const orderStatus = [
    {
        label: '待结算',
        value: 1,
    },
    {
        label: '已结算',
        value: 2,
    },
    {
        label: '待退单',
        value: 3,
    },
    {
        label: '已退单',
        value: 4,
    },
    {
        label: '已取消',
        value: 5,
    },
];
// 结算方式
export const paymentType = [
    {
        label: '现金',
        value: 1,
    },
    {
        label: '存卡',
        value: 2,
    },
    {
        label: '佣金',
        value: 3,
    },
    {
        label: '积分',
        value: 4,
    },
    {
        label: '礼遇金赠送',
        value: 5,
    },
    {
        label: '部门赠送',
        value: 6,
    },
];
// 消费类型
export const consume_type = [
    {
        label: '订车',
        value: 1,
    },
    {
        label: '房间',
        value: 2,
    },
    {
        label: '餐饮',
        value: 3,
    },
    {
        label: '娱乐',
        value: 4,
    },
    {
        label: '其他',
        value: 5,
    },
];

//marker类型
export const markerType = [
    {
        label: '股东授信',
        value: 1,
    },
    {
        label: '上线批额',
        value: 2,
    },
    {
        label: '公司批额',
        value: 3,
    },
    {
        label: '临时批额',
        value: 4,
    },
    {
        label: '股本',
        value: 5,
    },
    {
        label: '禁用批额',
        value: 6,
    },
];

//marker类型
export const amountType = [
    {
        label: '减额',
        value: 5,
    },
    {
        label: '增额',
        value: 6,
    },
];

//marker操作类型
export const markerActionType = [
    {
        label: '批额',
        value: 1,
    },
    {
        label: '签M',
        value: 2,
    },
    {
        label: '还M',
        value: 3,
    },
    {
        label: '利息',
        value: 4,
    },
    {
        label: '下批',
        value: 5,
    },
    {
        label: '受批',
        value: 6,
    },
    {
        label: '回收',
        value: 7,
    },
    {
        label: '归还',
        value: 8,
    },
    {
        label: '上分',
        value: 9,
    },
    {
        label: '利息清除',
        value: 10,
    },
    {
        label: '加彩',
        value: 11,
    },
    {
        label: '逾期',
        value: 12,
    },
];

//marker操作详细类型
export const markerActionDetailType = [
    {
        label: '股东批额',
        value: 1,
    },
    {
        label: '上线批额',
        value: 2,
    },
    {
        label: '公司批额',
        value: 3,
    },
    {
        label: '临时批额',
        value: 4,
    },
    {
        label: '股本批额',
        value: 5,
    },
    {
        label: '签M',
        value: 6,
    },
    {
        label: '还M',
        value: 7,
    },
    {
        label: '还M利息',
        value: 8,
    },
    {
        label: '下线批额',
        value: 9,
    },
    {
        label: '受批',
        value: 10,
    },
    {
        label: '股东授信',
        value: 11,
    },
    {
        label: '股东授信回收',
        value: 12,
    },
    {
        label: '临时额度过期',
        value: 13,
    },
    {
        label: '归还额度',
        value: 14,
    },
    {
        label: '回收',
        value: 15,
    },
    {
        label: '利息清除',
        value: 16,
    },
    {
        label: '上分',
        value: 17,
    },
    {
        label: '加彩',
        value: 18,
    },
    {
        label: '逾期罚息',
        value: 19,
    },
];

// 线路类型
export const smsLineTypes = [
    {
        value: 1,
        label: '主线',
    },
    {
        value: 2,
        label: '副线',
    },
];

//内部卡类型
export const internalCardType = [
    {
        label: '运营卡',
        value: 'YUNYIN_CARD',
        cardNumber: 'OK88888',
    },
    {
        label: '过数卡',
        value: 'GS_CARD',
        cardNumber: 'guoshu',
    },
    {
        label: 'RATE',
        value: 'RATE',
        cardNumber: 'rate',
    },
    {
        label: 'Y卡',
        value: 'Y_CARD',
        cardNumber: 'yingy',
    },

    {
        label: '息卡',
        value: 'FAXI',
        cardNumber: 'faxi',
    },
    {
        label: '场面柴卡',
        value: 'SCEN_CHAIKA',
        cardNumber: 'props',
    },
    {
        label: '佣金卡',
        value: 'YONGJIN_CARD',
        cardNumber: 'comm',
    },
    {
        label: 'B佣卡',
        value: 'B_CARD',
        cardNumber: 'bcomm',
    },
    {
        label: '盈1',
        value: 'YIN1',
        cardNumber: 'ying1',
    },
    {
        label: '盈2',
        value: 'PROFI2',
        cardNumber: 'ying2',
    },
    {
        label: '盈8',
        value: 'PROFI8',
        cardNumber: 'ying8',
    },
    {
        label: '盈9',
        value: 'PROFI9',
        cardNumber: 'ying9',
    },
    {
        label: '代理钱包A',
        value: 'PROXY_WALLET_A',
        cardNumber: 'game',
    },
    {
        label: '代理钱包B',
        value: 'PROXY_WALLET_B',
        cardNumber: 'bgame',
    },
    {
        label: '盈0',
        value: 'PROFI0',
        cardNumber: 'online',
    },
];

//性别
export const genderType = [
    {
        label: '男',
        value: 1,
    },
    {
        label: '女',
        value: 2,
    },
];

//菜单类型
export const menuType = [
    {
        label: '菜单',
        value: 'M',
    },
    {
        label: '按钮',
        value: 'B',
    },
];

//帐变类型
export const proposalType = [
    {
        label: '存款',
        value: 1,
    },
    {
        label: '提取',
        value: 2,
    },
    {
        label: '冻结',
        value: 3,
    },
    {
        label: '解冻',
        value: 4,
    },
];

//帐变详细类型
export const proposalDetailType = [
    {
        label: '存款',
        value: 1,
    },
    {
        label: '转账入款',
        value: 2,
    },
    {
        label: '货币兑入',
        value: 3,
    },
    {
        label: '回码存入',
        value: 4,
    },
    {
        label: '消费退款',
        value: 5,
    },
    {
        label: '游戏下分',
        value: 6,
    },
    {
        label: '佣金存卡',
        value: 7,
    },
    {
        label: '收工存入',
        value: 8,
    },
    {
        label: '营运存入',
        value: 9,
    },
    {
        label: '占成收益',
        value: 10,
    },
    {
        label: '取款',
        value: 11,
    },
    {
        label: '取款加彩',
        value: 12,
    },
    {
        label: '转账出款',
        value: 13,
    },
    {
        label: '货币兑出',
        value: 14,
    },
    {
        label: '开工取款',
        value: 15,
    },
    {
        label: '游戏上分',
        value: 16,
    },
    {
        label: '消费结算',
        value: 17,
    },
    {
        label: '占成找数',
        value: 18,
    },
    {
        label: '营运支出',
        value: 19,
    },
    {
        label: '占成佣金找数',
        value: 20,
    },
    {
        label: '佣金现金',
        value: 21,
    },
    {
        label: '还M',
        value: 22,
    },
    {
        label: '还罚息',
        value: 23,
    },
    {
        label: '保证金冻结',
        value: 24,
    },
    {
        label: '手动冻结',
        value: 25,
    },
    {
        label: '消费冻结',
        value: 26,
    },
    {
        label: '保证金解冻',
        value: 27,
    },
    {
        label: '保证金冻结',
        value: 28,
    },
    {
        label: '手动解冻',
        value: 29,
    },
    {
        label: '消费解冻',
        value: 30,
    },
];

//更次
export const intervalType = [
    {
        label: '早',
        value: 1,
    },
    {
        label: '中',
        value: 2,
    },
    {
        label: '晚',
        value: 3,
    },
];

//信贷类型 1 股东 2 上线 3 公司 4 临时 5 股本
export const mCreditType = [
    {
        label: '股东M',
        value: 1,
    },
    {
        label: '上线M',
        value: 2,
    },
    {
        label: '公司M',
        value: 3,
    },
    {
        label: '临时M',
        value: 4,
    },
    {
        label: '股本M',
        value: 5,
    },
    {
        label: '禁批M',
        value: 6,
    },
];

// 支付方式

export const PayType = [
    {
        label: '现金',
        value: 1,
    },
    {
        label: '支票',
        value: 2,
    },
    {
        label: '本票',
        value: 3,
    },
    {
        label: 'Credit',
        value: 4,
    },
    {
        label: '电汇',
        value: 5,
    },
];

export const BuyRecordType = [
    {
        label: '现金',
        value: 1,
    },
    {
        label: '支票',
        value: 2,
    },
    {
        label: '本票',
        value: 3,
    },
    {
        label: 'Credit',
        value: 4,
    },
    {
        label: '电汇',
        value: 5,
    },
    {
        label: '转码',
        value: 8,
    },
];
export const BuyRecordOperateType = [
    {
        label: '买码',
        value: 1,
    },
    {
        label: '转码',
        value: 2,
    },
    {
        label: '退码',
        value: 3,
    },
];
export const shiftMap: any = {
    1: '早更',
    2: '中更',
    3: '夜更',
};
export const shiftType = [
    {
        value: 1,
        label: '早更',
    },
    {
        value: 2,
        label: '中更',
    },
    {
        value: 3,
        label: '夜更',
    },
];

//marker类型
export const markerReportType = [
    {
        label: '股东',
        value: 1,
    },
    {
        label: '上线',
        value: 2,
    },
    {
        label: '公司',
        value: 3,
    },
    {
        label: '临时',
        value: 4,
    },
    {
        label: '股本',
        value: 5,
    },
];

//marker还款状态
export const markerReportState = [
    {
        label: '待还款',
        value: 1,
    },
    {
        label: '已还款',
        value: 2,
    },
];

//存取款报表交易类型
export const detailTradetype = [
    {
        label: '存款',
        value: 1,
    },
    {
        label: '转账入款',
        value: 2,
    },
    {
        label: '货币兑入',
        value: 3,
    },
    {
        label: '回码存入',
        value: 4,
    },
    {
        label: '消费退款',
        value: 5,
    },
    {
        label: '游戏下分',
        value: 6,
    },
    {
        label: '佣金存卡',
        value: 7,
    },
    {
        label: '收工存入',
        value: 8,
    },
    {
        label: '营运存入',
        value: 9,
    },
    {
        label: '占成收益',
        value: 10,
    },
    {
        label: '取款',
        value: 11,
    },
    {
        label: '取款加彩',
        value: 12,
    },
    {
        label: '转账出款',
        value: 13,
    },
    {
        label: '货币兑出',
        value: 14,
    },
    {
        label: '开工取款',
        value: 15,
    },
    {
        label: '游戏上分',
        value: 16,
    },
    {
        label: '消费结算',
        value: 17,
    },
    {
        label: '占成找数',
        value: 18,
    },
    {
        label: '营运支出',
        value: 19,
    },
    {
        label: '占成佣金找数',
        value: 20,
    },
    {
        label: '佣金现金',
        value: 21,
    },
    {
        label: '还M',
        value: 22,
    },
    {
        label: '还罚息',
        value: 23,
    },
    {
        label: '保证金冻结',
        value: 24,
    },
    {
        label: '手动冻结',
        value: 25,
    },
    {
        label: '消费冻结',
        value: 26,
    },
    {
        label: '保证金解冻',
        value: 27,
    },
    {
        label: '保证金冻结',
        value: 28,
    },
    {
        label: '手动解冻',
        value: 29,
    },
    {
        label: '消费解冻',
        value: 30,
    },
    {
        label: '现金',
        value: 31,
    },
];

// 验证身份
export const memberIdentityType = [
    {
        label: '户主',
        value: 1,
    },
    {
        label: '授权人',
        value: 2,
    },
];

// 验证方式
export const identityWay = [
    {
        label: '电话',
        value: 1,
    },
    {
        label: '现场',
        value: 2,
    },
];

// 验证方式
export const identityStatus = [
    {
        label: '验证成功',
        value: 1,
    },
    {
        label: '验证失败',
        value: 2,
    },
];

// 验证模块
export const identityModule = [
    {
        label: '取款',
        value: 1,
    },
    {
        label: '转账',
        value: 2,
    },
    {
        label: '还Marker',
        value: 3,
    },
    {
        label: '即出',
        value: 4,
    },
    {
        label: '月结',
        value: 5,
    },
    {
        label: '开工',
        value: 6,
    },
    {
        label: '加彩',
        value: 7,
    },
    {
        label: '股东授信',
        value: 8,
    },
    {
        label: '现场认证',
        value: 9,
    },
];

//转账类型
export const transferType = [
    {
        label: '客户户口',
        value: 1,
    },
    {
        label: '公司户口',
        value: 2,
    },
    {
        label: '内部卡',
        value: 3,
    },
];

//转账类型
export const monthlyStatusType = [
    {
        label: '未结算',
        value: 0,
    },
    {
        label: '已结算',
        value: 1,
    },
    {
        label: '异常汇率',
        value: 3,
    },
    {
        label: '冻结',
        value: 5,
    },
];

//转账类型
export const accountRemarkStatusType = [
    {
        label: '添加',
        value: 'add',
    },
    {
        label: '修改',
        value: 'update',
    },
    {
        label: '删除',
        value: 'delete',
    },
];

// 入场身份
export const sceneIdentifyType = [
    { label: '代理', value: 1 },
    { label: '玩家', value: 2 },
];

// 下批受批类型
export const fromToMarkType = [
    { label: '股东授信额度', value: 1 },
    { label: '上线额度', value: 2 },
    { label: '公司额度', value: 3 },
    { label: '临时额度', value: 4 },
    { label: '股本额度', value: 4 },
    { label: '禁批额度', value: 6 },
];
