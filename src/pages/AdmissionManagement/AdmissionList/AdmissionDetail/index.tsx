/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp, useNewWindow } from '@/hooks';
import { Row, Col, Input, Button, message, Popover, Typography } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import { getAccountDetail } from '@/api/admission';
import { GetAccountDetailParams, AccountDetails } from '@/types/api/admission';
import { formatCurrency } from '@/utils/tools';
import LotteryPlus from './LotteryPlus';
import ReturnChips from './ReturnChips';
import TurnOver from './TurnOver';
import DealerTurnOver from './DealerTurnOver';
import TemporaryStorage from './TemporaryStorage';
import GetTemporaryStorage from './GetTemporaryStorage';
import RecordListData from '../../components/RecordListTable';
import KnockOff from './KnockOff/index';
import { getLocalStorage } from '@/utils/localStorage';
import {
    getStartWorkDetails,
    getFrozenAmount,
    updateStartWorkDetails,
} from '@/api/admission';
import {
    GetStartWorkDetailsParams,
    UpdateStartWorkDetailsParams,
} from '@/types/api/admission';

import { admissionType, workType } from '@/common/commonConstType';
import './index.scoped.scss';
const { TextArea } = Input;
type AdmissionDetailProps = {};
interface Data {
    label: string;
    value: number;
}
interface Details {
    club_name: string;
    customer_name: string;
    table_num: string;
    member_code: string;
    member_name: string;
    round: string;
    admission_type: number;
    currency: number;
    start_work_type: number;
    principal_type: string;
    shares_type: string;
    shares_rate: string;
    shares_bottom_rate?: string;
    currency_name: string;
    chips_name: string;
    scene_identity: number;
}

const AdmissionDetail: FC<AdmissionDetailProps> = () => {
    const { toNewWindow } = useNewWindow();
    const params = useParams();
    const [remark, setRemark] = useState('');
    const [refresh, setRefresh] = useState(false);
    const [storageRefresh, setStorageRefresh] = useState(false);
    const [fundRefresh, setFundRefresh] = useState(false);
    const [memberId, setMemberId] = useState('');
    const [currency, setCurrency] = useState(0);
    const [frozenAmount, setFrozenAmount] = useState(0);
    const [accountStatus, setAccountStatus] = useState(3);

    const [detailInfo, setDetailInfo] = useState<any>({});
    // 基础信息
    const [dataInfo, setDataInfo] = useState<Details>({} as Details);
    const { fetchData: getAccountDetailData } = useHttp<
        GetAccountDetailParams,
        AccountDetails
    >(getAccountDetail);
    useEffect(() => {
        getAccountDetailData({ round: params.id || '' }).then((res: any) => {
            if (res.code === 10000) {
                const data = res.data || {};
                setCurrency(data.currency);
                setMemberId(data.member_id);
                setDataInfo(data);
            }
        });
    }, []);
    const { fetchData: featchGetStartWorkDetails } = useHttp<
        GetStartWorkDetailsParams,
        any
    >(getStartWorkDetails);

    const { fetchData: featchUpdateStartWorkDetails } = useHttp<
        UpdateStartWorkDetailsParams,
        any
    >(updateStartWorkDetails);

    // 查询占成冻结保证金
    const { fetchData: featchGetFrozenAmount } = useHttp<
        GetStartWorkDetailsParams,
        any
    >(getFrozenAmount);

    const admissIdentity = [
        { label: '', value: 0 },
        { label: '代理', value: 1 },
        { label: '玩家', value: 2 },
    ];

    const featchGetFrozenAmountReq = () => {
        featchGetFrozenAmount({ round: params.id || '' }).then((res) => {
            setFrozenAmount(res.data || {});
        });
    };

    const getLabel = (data: Array<Data>, value: number) => {
        return data.find((item) => item.value === value)?.label;
    };

    const formatCurrencyStr = (currency: any) => {
        return formatCurrency(currency + '') + '万';
    };
    const getDetail = () => {
        featchGetStartWorkDetails({ round: params.id || '' }).then(
            (res: any) => {
                if (res.code === 10000) {
                    const { data } = res;
                    setAccountStatus(data.account_status);
                    setDetailInfo(data);
                    setRemark(data.remark);
                }
            },
        );
    };

    useEffect(() => {
        // 请求详情
        getDetail();
        // 刷新占成保证金
        featchGetFrozenAmountReq();

        // 刷新资金记录
        refreshOpen();
        // 暂存记录刷新
        storageRefreshOpen();
        // 资金记录刷新
        fundRefreshOpen();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const OnlyReadInput = (itemProps: { label: string; value: any }) => {
        const { label, value } = itemProps;
        return (
            <div className="a-detail-onlyready">
                <span>{label}</span>
                <div className="a-detail-input">
                    {label === '户口名：' ||
                    label === '客户名：' ||
                    label === '出码人：' ? (
                        <Popover title={value}>
                            <Typography.Text ellipsis>{value}</Typography.Text>
                        </Popover>
                    ) : label === '户口号：' ? (
                        <span
                            className="m-primary-font-color pointer"
                            onClick={() =>
                                toNewWindow(
                                    `/account/customerAccountDetail/${value}`,
                                )
                            }
                        >
                            {value}
                        </span>
                    ) : (
                        value
                    )}
                </div>
            </div>
        );
    };

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setRemark(e.target.value);
    };
    const { backPath } = getLocalStorage('detailPageInfo') ?? {};

    // 转码记录
    const refreshOpen = () => {
        setRefresh(true);
    };
    const refreshClose = () => {
        setRefresh(false);
    };

    // 暂存列表刷新
    const storageRefreshOpen = () => {
        setStorageRefresh(true);
    };
    const storageRefreshClose = () => {
        setStorageRefresh(false);
    };

    // 资金记录
    const fundRefreshOpen = () => {
        setFundRefresh(true);
    };
    const fundRefreshClose = () => {
        setFundRefresh(false);
    };

    const temporaryOnSuccess = useCallback(() => {
        storageRefreshOpen();
        refreshOpen();
        getDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderItem = (
        label: string,
        value: string | number | undefined,
        isAmount?: boolean,
    ) => {
        return (
            <>
                <Col className="knock-item-label" span={3}>
                    {label}
                </Col>
                <Col className="knock-item-value" span={4}>
                    {isAmount ? `${formatCurrency(value + '')}万` : value}
                </Col>
            </>
        );
    };

    const renderDetail = () => {
        return (
            <>
                <div className="kock-item">
                    <Row className="kock-item-title">【基础信息】</Row>
                    <Row>
                        {renderItem('场馆：', dataInfo.club_name)}
                        {renderItem('场次：', dataInfo.round)}
                        {renderItem('户口号：', dataInfo.member_code)}
                    </Row>

                    <Row>
                        {renderItem('户口名：', dataInfo.member_name)}
                        {renderItem('出码人：', dataInfo.member_name)}
                        {renderItem(
                            '入场类型：',
                            getLabel(admissionType, dataInfo.admission_type),
                        )}
                    </Row>
                    <Row>
                        {renderItem(
                            '入场身份：',
                            getLabel(admissIdentity, dataInfo.scene_identity),
                        )}
                        {renderItem('开工币种：', dataInfo.currency_name)}
                        {renderItem(
                            '开工类型：',
                            getLabel(workType, dataInfo.start_work_type),
                        )}
                    </Row>
                    <Row>
                        {renderItem('本金类型：', dataInfo.principal_type)}
                        {renderItem('出码类型：', dataInfo.shares_type)}
                        {renderItem('筹码名称：', dataInfo.chips_name)}
                    </Row>
                    <Row>
                        <Col className="knock-item-label" span={3} offset={3}>
                            客户名：
                        </Col>
                        <Col className="knock-item-value" span={3} offset={3}>
                            {dataInfo.customer_name}
                        </Col>
                    </Row>
                </div>
                <div className="kock-item kock-item-blue">
                    <Row className="kock-item-title">【台面】</Row>
                    <Row>
                        {renderItem(
                            '总本金：',
                            detailInfo?.table_up_delivery?.total_principal,
                            true,
                        )}
                        {renderItem(
                            '总加彩：',
                            detailInfo?.table_up_delivery?.total_add_chips,
                            true,
                        )}
                        {renderItem(
                            '总回码：',
                            detailInfo?.table_up_delivery?.total_return_chips,
                            true,
                        )}
                    </Row>
                    <Row>
                        {renderItem(
                            '转码数：',
                            detailInfo?.table_up_delivery?.total_convert_chips,
                            true,
                        )}
                        {renderItem(
                            '离台数：',
                            detailInfo?.table_up_delivery?.leave_table_chips,
                            true,
                        )}
                        {renderItem(
                            '上下数：',
                            detailInfo?.table_up_delivery?.up_down_chips,
                            true,
                        )}
                    </Row>
                    <Row>
                        {renderItem(
                            '公水：',
                            detailInfo?.table_up_delivery
                                ?.total_public_tip_chips,
                            true,
                        )}
                        {renderItem(
                            '荷水：',
                            detailInfo?.table_up_delivery
                                ?.total_croupier_tip_chips,
                            true,
                        )}
                        {renderItem(
                            '总暂存：',
                            detailInfo?.table_up_delivery
                                ?.total_temporary_chips,
                            true,
                        )}
                    </Row>
                </div>
                {detailInfo?.shares_type_b_delivery ? (
                    <div className="kock-item kock-item-green">
                        <Row className="kock-item-title">【B数交收】</Row>
                        <Row>
                            {renderItem(
                                '占成比：',
                                detailInfo?.shares_type_b_delivery?.shares_rate,
                            )}
                            {renderItem(
                                '占成找数：',
                                detailInfo?.shares_type_b_delivery
                                    ?.shares_rate_value,
                                true,
                            )}
                        </Row>
                    </div>
                ) : (
                    ''
                )}
                {detailInfo?.steal_food_delivery ? (
                    <div className="kock-item kock-item-purple">
                        <Row className="kock-item-title">【偷食交收】</Row>
                        <Row>
                            {renderItem(
                                '偷食占成比：',
                                detailInfo?.steal_food_delivery
                                    ?.share_parent_number,
                            )}
                            {renderItem(
                                '占成找数：',
                                detailInfo?.steal_food_delivery
                                    ?.share_parent_value,
                                true,
                            )}
                            {renderItem(
                                '偷食佣金率：',
                                detailInfo?.steal_food_delivery
                                    ?.commission_rate,
                            )}
                        </Row>
                        <Row>
                            {renderItem(
                                '佣金找数：',
                                detailInfo?.steal_food_delivery
                                    ?.commission_rate_value,
                                true,
                            )}
                            {renderItem(
                                '免佣占成比：',
                                detailInfo?.steal_food_delivery
                                    ?.share_number_other,
                            )}
                            {renderItem(
                                '占成找数：',
                                detailInfo?.steal_food_delivery
                                    ?.share_parent_value_other,
                                true,
                            )}
                        </Row>
                    </div>
                ) : (
                    ''
                )}
                {detailInfo?.operation_delivery ? (
                    <div className="kock-item kock-item-yellow">
                        <Row className="kock-item-title">【营运交收】</Row>
                        <Row>
                            {renderItem(
                                '台底倍数：',
                                detailInfo?.operation_delivery
                                    ?.table_bottom_multiple,
                            )}
                            {renderItem(
                                '台底押金：',
                                detailInfo?.operation_delivery
                                    ?.table_bottom_deposit,
                                true,
                            )}{' '}
                            {renderItem(
                                '台底上下数：',
                                detailInfo?.operation_delivery
                                    ?.table_bottom_up_down_chips,
                                true,
                            )}
                        </Row>
                        <Row>
                            {renderItem(
                                '台底转码数：',
                                detailInfo?.operation_delivery
                                    ?.table_bottom_convert_chips,
                                true,
                            )}
                        </Row>
                    </div>
                ) : (
                    ''
                )}
                {detailInfo?.table_bottom_shares_type_b_delivery ? (
                    <div className="kock-item ">
                        <Row className="kock-item-title">【台底B数交收】</Row>
                        <Row>
                            {renderItem(
                                '台底占成比：',
                                detailInfo?.table_bottom_shares_type_b_delivery
                                    ?.table_bottom_shares_rate,
                            )}
                            {renderItem(
                                '台底占成找数：',
                                detailInfo?.table_bottom_shares_type_b_delivery
                                    ?.table_bottom_shares_value,
                                true,
                            )}
                        </Row>
                    </div>
                ) : (
                    ''
                )}
                {detailInfo?.other_member_shares_b_delivery &&
                detailInfo?.other_member_shares_b_delivery.length > 0 ? (
                    <div className="kock-item kock-item-purple2">
                        <Row className="kock-item-title">
                            【其他户口B数交收】
                        </Row>
                        {detailInfo?.other_member_shares_b_delivery.map(
                            (item: any, index: number) => {
                                return (
                                    <Row key={index}>
                                        {renderItem(
                                            '台底占成比：',
                                            item.share_number,
                                        )}
                                        {renderItem(
                                            '台底占成找数：',
                                            item.share_value,
                                            true,
                                        )}
                                        {renderItem(
                                            '户口号：',
                                            item.share_member,
                                        )}
                                    </Row>
                                );
                            },
                        )}
                    </div>
                ) : (
                    ''
                )}
            </>
        );
    };
    return (
        <ProCard
            style={{
                height: 'calc(100vh - 150px)',
                overflowY: 'auto',
            }}
        >
            {accountStatus !== 3 && (
                <Row
                    gutter={16}
                    style={{ height: '42px', paddingBottom: '10px' }}
                >
                    <Col span={2}>
                        <LotteryPlus
                            dataInfo={dataInfo}
                            member_id={memberId}
                            currency={currency}
                            frozenAmount={frozenAmount}
                            onSuccess={() => {
                                refreshOpen();
                                fundRefreshOpen();
                                getDetail();
                                featchGetFrozenAmountReq();
                            }}
                        />
                    </Col>
                    <Col span={2}>
                        <ReturnChips
                            dataInfo={dataInfo}
                            frozenAmount={frozenAmount}
                            onSuccess={() => {
                                refreshOpen();
                                fundRefreshOpen();
                                getDetail();
                                featchGetFrozenAmountReq();
                            }}
                        />
                    </Col>
                    <Col span={2}>
                        <TurnOver
                            onSuccess={() => {
                                getDetail();
                                fundRefreshOpen();
                                refreshOpen();
                            }}
                        />
                    </Col>
                    <Col span={2}>
                        <DealerTurnOver
                            onSuccess={() => {
                                getDetail();
                                fundRefreshOpen();
                                refreshOpen();
                            }}
                        />
                    </Col>
                    <Col span={2}>
                        <TemporaryStorage onSuccess={temporaryOnSuccess} />
                    </Col>
                    <Col span={2}>
                        <GetTemporaryStorage onSuccess={temporaryOnSuccess} />
                    </Col>
                    <Col span={10}></Col>
                    <Col span={2}>
                        <KnockOff
                            total_principal={
                                detailInfo?.table_up_delivery?.total_principal
                            }
                            onSuccess={() => {
                                getDetail();
                                fundRefreshOpen();
                                refreshOpen();
                                storageRefreshOpen();
                            }}
                        />
                    </Col>
                </Row>
            )}

            <Row
                style={{
                    height: `${
                        backPath && backPath !== '/admission/record'
                            ? 'calc(100% - 32px)'
                            : '100%'
                    }`,
                }}
            >
                <Col
                    span={11}
                    style={{
                        height: '100%',
                        overflowY: 'auto',
                        padding: '10px',
                    }}
                >
                    <div className="a-detail-itembox">{renderDetail()}</div>
                    <div className="a-detail-textarea">
                        <span>备注：</span>
                        <TextArea
                            disabled={accountStatus === 3}
                            value={remark}
                            showCount
                            maxLength={100}
                            style={{ height: 80, width: 'calc(50% + 148px)' }}
                            onChange={onChange}
                        />
                    </div>

                    <div className="a-detail-submit">
                        <Button
                            disabled={accountStatus === 3}
                            type="primary"
                            onClick={() => {
                                featchUpdateStartWorkDetails({
                                    round: params.id || '',
                                    remark,
                                })
                                    .then((res) => {
                                        if (res.code === 10000) {
                                            message.success('请求成功');
                                        } else {
                                            message.error(res.msg);
                                        }
                                    })
                                    .catch((err) => {
                                        message.error(err.msg);
                                    });
                            }}
                        >
                            保存
                        </Button>
                    </div>
                </Col>
                <Col
                    span={13}
                    style={{
                        height: '100%',
                        overflowY: 'auto',
                        padding: '10px',
                    }}
                >
                    <RecordListData
                        refresh={refresh}
                        refreshClose={refreshClose}
                        storageRefresh={storageRefresh}
                        storageRefreshClose={storageRefreshClose}
                        fundRefresh={fundRefresh}
                        fundRefreshClose={fundRefreshClose}
                    />
                </Col>
            </Row>
        </ProCard>
    );
};

export default AdmissionDetail;
