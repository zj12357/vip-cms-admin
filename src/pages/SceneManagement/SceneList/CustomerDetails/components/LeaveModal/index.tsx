import React, { FC, useState, useEffect, useRef } from 'react';
import { Button, Radio, message } from 'antd';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import useHttp from '@/hooks/useHttp';
import { getLeaverConfirmInfo, customerDetailUpdate } from '@/api/scene';
import { CustomerDetailUpdateParams } from '@/types/api/scene';
import { selectCurrencyList } from '@/store/common/commonSlice';
import '../../index.scoped.scss';
import { formatCurrency } from '@/utils/tools';
import { admissionType, workType } from '@/common/commonConstType';
import FormCurrency from '@/components/Currency/FormCurrency';

type LeaveModalProps = {
    item: {
        label: string;
        selected: boolean;
        color: string;
    };
    cutomerInfo: any;
    onSuccess: () => void;
};

const LeaveModal: FC<LeaveModalProps> = (props) => {
    const params = useParams();
    const { item, cutomerInfo = {}, onSuccess } = props;
    const [leaveInfo, setLeaveInfo] = useState<any>({});
    const currencyList = useAppSelector(selectCurrencyList);
    const { fetchData: fetchCustomerDetailUpdate } = useHttp<
        CustomerDetailUpdateParams,
        any
    >(customerDetailUpdate);
    const { fetchData: fetchGetLeaverConfirmInfo } = useHttp<any, any>(
        getLeaverConfirmInfo,
    );
    const fetchGetLeaverConfirmInfoReq = () => {
        if (!params.id) {
            return;
        }
        fetchGetLeaverConfirmInfo({ round: params.id }).then((res) => {
            setLeaveInfo(res.data || {});
        });
    };
    useEffect(() => {
        fetchGetLeaverConfirmInfoReq();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cutomerInfo.scene_status]);
    return (
        <ModalForm
            layout="horizontal"
            trigger={
                <Button
                    size="small"
                    style={{
                        marginRight: '8px',
                        color: item.color,
                    }}
                    type={item.selected ? 'primary' : 'default'}
                >
                    ??????
                </Button>
            }
            onFinish={async (values: any) => {
                const res = await fetchCustomerDetailUpdate({
                    ...values,
                    scene_status: 3,
                    round: params.id,
                });

                if (res.code === 10000) {
                    onSuccess();
                    message.success('????????????');
                    return true;
                }
            }}
            title="????????????"
            style={{
                maxHeight: '70vh',
                overflowY: 'auto',
            }}
        >
            <div className="lm-modal">
                <div className="lm-left">
                    <div className="lm-left-item">
                        <div className="lm-left-label">{`????????????${formatCurrency(
                            leaveInfo.total_principal,
                        )}`}</div>
                        <p>
                            <span>{`???????????????${leaveInfo.start_work_principal_type}`}</span>
                            <span>{`????????????${leaveInfo.total_add_chips_type}`}</span>
                        </p>
                    </div>
                    <div className="lm-left-item">
                        <div className="lm-left-label">{`????????????${formatCurrency(
                            leaveInfo.total_return_chips,
                        )}`}</div>
                        <p>
                            <span>{`???M???${formatCurrency(
                                leaveInfo.return_chips_marker_settlement,
                            )}`}</span>
                            <span>{`?????????${formatCurrency(
                                leaveInfo.return_chips_deposit_card_settlement,
                            )}`}</span>
                            <span>{`?????????${formatCurrency(
                                leaveInfo.return_chips_cash_settlement,
                            )}`}</span>
                        </p>
                    </div>
                    <div className="lm-left-item">
                        <div className="lm-left-label">{`???????????????${formatCurrency(
                            leaveInfo.stop_work_principal,
                        )}`}</div>
                        <p>
                            <span>{`?????????${formatCurrency(
                                leaveInfo.mud_chips,
                            )}`}</span>
                            <span>{`????????????${formatCurrency(
                                leaveInfo.cash_chips,
                            )}`}</span>
                        </p>
                    </div>
                    <div className="lm-left-item">
                        <div className="lm-left-label">{`?????????${formatCurrency(
                            leaveInfo.tip_chips,
                        )}`}</div>
                    </div>
                    <div className="lm-left-item">
                        <div className="lm-left-label">{`????????????${formatCurrency(
                            leaveInfo.leave_table_chips,
                        )}`}</div>
                        <p>
                            <span>{`???M???${formatCurrency(
                                leaveInfo.stop_work_marker_settlement,
                            )}`}</span>
                            <span>{`???WC???${formatCurrency(
                                leaveInfo.stop_work_deposit_card_settlement,
                            )}`}</span>
                            <span>{`?????????${formatCurrency(
                                leaveInfo.stop_work_cash_settlement,
                            )}`}</span>
                        </p>
                    </div>
                    <div className="lm-left-item-one">
                        <div className="lm-left-label">{`???????????????${formatCurrency(
                            leaveInfo.total_up_down_chips,
                        )}`}</div>
                        <div className="lm-left-label">{`???????????????${formatCurrency(
                            leaveInfo.total_convert_chips,
                        )}`}</div>
                    </div>
                </div>
                <div className="lm-right">
                    <div className="lm-right-content">
                        <p className="lm-right-item">
                            ????????????<span>{cutomerInfo.customer_name}</span>
                        </p>
                        <p className="lm-right-item">
                            ?????????<span>{cutomerInfo.table_num}</span>
                        </p>
                        <p className="lm-right-item">
                            ???????????????
                            <span>
                                {
                                    admissionType.find(
                                        (item) =>
                                            item.value ===
                                            cutomerInfo.admission_type,
                                    )?.label
                                }
                            </span>
                        </p>
                        <p className="lm-right-item">
                            ???????????????
                            <span>
                                {
                                    currencyList.find(
                                        (item) =>
                                            item.value === cutomerInfo.currency,
                                    )?.label
                                }
                            </span>
                        </p>
                        <p className="lm-right-item">
                            ???????????????
                            <span>{cutomerInfo.shares_type}</span>
                        </p>
                        <p className="lm-right-item">
                            ???????????????
                            <span>
                                {
                                    workType.find(
                                        (item) =>
                                            item.value ===
                                            cutomerInfo.start_work_type,
                                    )?.label
                                }
                            </span>
                        </p>
                        <p className="lm-right-item">
                            ???????????????
                            <span>{cutomerInfo.principal_type}</span>
                        </p>
                        <p className="lm-right-item">
                            ????????????
                            <span>{`${cutomerInfo.shares_rate}%,${cutomerInfo.shares_bottom_rate}%`}</span>
                        </p>
                    </div>
                    <ProForm.Group>
                        <FormCurrency
                            width="sm"
                            name="bag_chips"
                            label="?????????"
                            placeholder=""
                        />
                    </ProForm.Group>
                </div>
            </div>
        </ModalForm>
    );
};

export default LeaveModal;
