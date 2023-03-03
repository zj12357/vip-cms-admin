import React, { FC } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ProTable, ProCard } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { useAppDispatch } from '@/store/hooks';
import { setDetailPageInfo } from '@/store/common/commonSlice';
import { useNewWindow } from '@/hooks';

type CompanyInternalCardProps = {};

export type InternalCardListItem = {
    cardNumber: string;
    cardName: string;
    cardId: string;
    description: React.ReactNode;
    formula: React.ReactNode;
};

export const tableListDataSource: InternalCardListItem[] = [
    {
        cardName: '运营卡',
        cardNumber: 'OK88888',
        description: <p>存放运营资金调度及月结平账使用</p>,
        formula: <p>部分内部卡与运营卡关联可在月结平数</p>,
        cardId: 'YUNYIN_CARD',
    },
    {
        cardName: '过数卡',
        cardNumber: 'guoshu',
        description: (
            <p>
                过数卡与外借银头绑定、客人跨场馆取款时，过数卡会做内部飞数记录、到达一定数额后可做现金提取飞数其他场馆存入，平外借银头
            </p>
        ),
        formula: (
            <p>
                当客人户口有动作跨场馆取款时，在取款场馆记录负数，在客人其他有余额场馆做正数
            </p>
        ),
        cardId: 'GS_CARD',
    },
    {
        cardName: 'RATE卡',
        cardNumber: 'rate',
        description: <p>货币兑换卡，用作货币兑换过数</p>,
        formula: (
            <p>
                当客人户口操作货币兑换时，兑入货币自动存入该卡、兑出货币按汇率会入客人户口
            </p>
        ),
        cardId: 'RATE',
    },
    {
        cardName: 'Y卡',
        cardNumber: 'yingy',
        description: <p>营运数交收卡，负责营运数台底部分交收</p>,
        formula: (
            <p>
                如营运开工，台底押金自动存入该卡，收工按照收工台面数*台底（托底）倍数进行结算交收台底押金部分
            </p>
        ),
        cardId: 'Y_CARD',
    },

    {
        cardName: '息卡',
        cardNumber: 'faxi',
        description: <p>戶口已签的借贷过期所生成的利息如有收取存入此卡</p>,
        formula: <p>客人回Marker借贷时如有还罚息则存入此卡</p>,
        cardId: 'FAXI',
    },
    {
        cardName: '场面柴卡',
        cardNumber: 'props',
        description: <p>账房出码给场面的线上营运筹码</p>,
        formula: (
            <p>
                场面出柴时从此卡提取金额出码，回柴时根据客人上下数与代理钱包平数，
                如客人赢钱，柴码多的部分则存入代理钱包平数；如客人输钱，柴码少的部分则从代理钱包提取平数
            </p>
        ),
        cardId: 'SCEN_CHAIKA',
    },
    {
        cardName: '佣金卡',
        cardNumber: 'comm',
        description: (
            <p>
                此卡用作自动交收客人佣金及月结，每当为客人操作转码即出\月结时根据公式自动过数到客人的卡
            </p>
        ),
        formula: (
            <p>
                转码数*转码类型佣金率%=佣金数，既出/月结提交后自动过数交收到客人户口
            </p>
        ),
        cardId: 'YONGJIN_CARD',
    },
    {
        cardName: 'B佣卡',
        cardNumber: 'bcomm',
        description: (
            <p>
                B数开工因转码所产生的B数转码佣金，
                如上线偷食下线时也有B数转码佣金
            </p>
        ),
        formula: (
            <p>
                B数半占会有佣金率.以本场转码数乘于半占佣金率，
                上线偷食下线.下线的转码也会产生佣金.以A数的佣金率乘以本场转码数
            </p>
        ),
        cardId: 'B_CARD',
    },
    {
        cardName: '盈1卡',
        cardNumber: 'ying1',
        description: <p>现场占成数交收卡，当客人有占成数收工结算时用来找数</p>,
        formula: (
            <p>
                根据客人占成%找数，客上时结算赢钱按占成%存入盈1卡，客下时按占成%提款存到客人账户
            </p>
        ),
        cardId: 'YIN1',
    },
    {
        cardName: '盈2卡',
        cardNumber: 'ying2',
        description: (
            <p>
                偷食户口的占成交收数，如上线偷食下线，下线是以A数开工，但对于上线是B数.完场须以离台数按占成比例去跟上线交收
            </p>
        ),
        formula: (
            <p>
                根据客人占成%找数，客上时结算赢钱按占成%存入盈2卡跟上线交收，客下时按占成%提款存到上线账户
            </p>
        ),
        cardId: 'PROFI2',
    },
    {
        cardName: '盈8卡',
        cardNumber: 'ying8',
        description: (
            <p>
                现场开工电投占成数交收卡，
                当客人有占成数电投开收工结算时自动用来过数找数
            </p>
        ),
        formula: (
            <p>
                开工时，根据客人开工占成%提取开工平数，余下未占成部分从客人存款提取开工出码，
                收工时，按收工台面数根据占成比存入盈8，余下客人未占部分存入客人户口
            </p>
        ),
        cardId: 'PROFI8',
    },
    {
        cardName: '盈9卡',
        cardNumber: 'ying9',
        description: <p>代理网钱包占成交收卡，当客人占成上分下分时过数</p>,
        formula: (
            <p>
                客人上分时，根据客人占成%从盈9提取到代理数钱包B平数
                客人下分时，则从代理钱包B按客人占成提取转入盈9平数
            </p>
        ),
        cardId: 'PROFI9',
    },
    {
        cardName: '代理钱包A卡',
        cardNumber: 'game',
        description: (
            <p>
                户口转账到代理网有零占交收方案钱包上分或下分到户口时使用此卡过数
            </p>
        ),
        formula: (
            <p>
                代理钱包0占上分时,从客人存款转入此卡，
                客人下分时从此卡转入户口过数， 柴卡回柴时根据上下数会与柴卡平数
            </p>
        ),
        cardId: 'PROXY_WALLET_A',
    },
    {
        cardName: '代理钱包B卡',
        cardNumber: 'bgame',
        description: (
            <p>
                户口转账到代理网有占成交收方案钱包上分或下分到户口时使用此卡过数
            </p>
        ),
        formula: (
            <p>
                客人代理钱包有占成，
                上分时，从客人存款提取相应占成余下百分比金额转入此卡，
                再从盈9提取客人占成百分比金额到此卡，
                下分时，按照占成余下百分比部分下分到客人存款，另外占成部分下分到盈9卡，
                柴卡回柴时根据上下数会与柴卡平数
            </p>
        ),
        cardId: 'PROXY_WALLET_B',
    },
    {
        cardName: '盈0卡',
        cardNumber: 'online',
        description: <p>线上虚拟投注交收卡</p>,
        formula: (
            <p>
                当线上开放有小额下注或下旁注，有涉及到无下实际筹码虚拟投注时，客人输赢数部分由代理钱包与此卡交收
            </p>
        ),
        cardId: 'PROFI0',
    },
];

const CompanyInternalCard: FC<CompanyInternalCardProps> = (props) => {
    const { toNewWindow } = useNewWindow();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const columns: ProColumns<InternalCardListItem>[] = [
        {
            title: '名称',
            dataIndex: 'cardName',
            width: '10%',
        },
        {
            title: '卡号',
            dataIndex: 'cardNumber',
            width: '10%',
        },
        {
            title: '功能描述',
            dataIndex: 'description',
        },
        {
            title: '公式',
            dataIndex: 'formula',
        },

        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            width: '10%',
            render: (text, record, _, action) => [
                <div
                    className="m-primary-font-color pointer"
                    key="detail"
                    onClick={() => toPage(record)}
                >
                    详情
                </div>,
            ],
        },
    ];

    const toPage = (value: InternalCardListItem) => {
        dispatch(
            setDetailPageInfo({
                path: `/account/companyInternalCardDetail/${value.cardId}`,
                backPath: '/account/companyInternalCard',
                title: '返回公司内部卡',
            }),
        );
        toNewWindow(
            `/account/companyInternalCardDetail/${value.cardId}?cardName=${value.cardName}&cardNumber=${value.cardNumber}`,
        );
    };

    return (
        <ProCard>
            <ProTable<InternalCardListItem>
                columns={columns}
                dataSource={tableListDataSource}
                rowKey={(item) => item.cardId}
                search={false}
                toolBarRender={false}
                scroll={{ x: 1000 }}
                pagination={false}
            />
        </ProCard>
    );
};

export default CompanyInternalCard;
