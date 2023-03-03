import React, { FC } from 'react';
import {
    ModalForm,
    ProForm,
    ProFormText,
    ProFormSelect,
    ProFormCheckbox,
    ProFormTextArea,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useHttp, useLatest } from '@/hooks';
import { createHall, updateHall } from '@/api/system';
import {
    HallListItem,
    CreateHallParams,
    UpdateHallParams,
} from '@/types/api/system';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';

type VenueModalFormProps = {
    trigger: JSX.Element;
    type: 'add' | 'edit';
    reloadData: () => void;
    record?: HallListItem;
};

const VenueModalForm: FC<VenueModalFormProps> = ({
    trigger,
    type,
    reloadData,
    record,
}) => {
    const venueTitle: Record<string, string> = {
        add: ' 新增场馆',
        edit: '编辑场馆',
    };
    const currencyList = useAppSelector(selectCurrencyList);

    const updatedValues = useLatest({
        hall_name: record?.hall_name,
        address: record?.address,
        currency: record?.currency,
        remark: record?.remark,
        white_ips: record?.white_ips,
    }).current;

    const { fetchData: _fetchCreateHall } = useHttp<CreateHallParams, null>(
        createHall,
        ({ msg }) => {
            message.success(msg);
            reloadData();
        },
    );

    const { fetchData: _fetchUpdateHall } = useHttp<UpdateHallParams, null>(
        updateHall,
        ({ msg }) => {
            message.success(msg);
            reloadData();
        },
    );

    const handleHall = (values: any) => {
        const commonParams = {
            hall_name: values.hall_name,
            address: values.address,
            currency: values.currency,
            remark: values.remark,
            white_ips: values.white_ips,
        };
        if (type === 'add') {
            return _fetchCreateHall({
                ...commonParams,
            });
        } else if (type === 'edit') {
            return _fetchUpdateHall({
                id: record?.id ?? 0,
                ...commonParams,
            });
        }
    };
    return (
        <div>
            <ModalForm
                trigger={trigger}
                onFinish={async (values: any) => {
                    const res = await handleHall(values);
                    if (res?.code === 10000) {
                        return true;
                    }
                }}
                title={venueTitle[type]}
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                }}
                initialValues={updatedValues}
            >
                <ProForm.Group>
                    <ProFormText
                        width="md"
                        name="hall_name"
                        label="场馆名称"
                        placeholder="请输入场馆名称"
                        rules={[
                            {
                                required: true,
                                message: '请输入场馆名称',
                            },
                        ]}
                    />
                    <ProFormText
                        width="md"
                        name="address"
                        label="场馆地址"
                        placeholder="请输入场馆地址"
                        rules={[
                            {
                                required: true,
                                message: '请输入场馆地址',
                            },
                        ]}
                    />
                </ProForm.Group>
                <ProForm.Group>
                    <ProFormSelect
                        name="currency"
                        label="场馆主货币"
                        width="md"
                        placeholder="请选择场馆主货币"
                        options={currencyList}
                        rules={[
                            {
                                required: true,
                                message: '请选择场馆主货币',
                            },
                        ]}
                        fieldProps={{
                            getPopupContainer: (triggerNode) =>
                                triggerNode.parentNode,
                        }}
                        showSearch
                    />
                    <ProFormTextArea
                        width="md"
                        name="white_ips"
                        label="ip白名单"
                        placeholder="请输入ip白名单，多个用｜隔开"
                    />
                </ProForm.Group>

                <ProForm.Group>
                    <ProFormTextArea
                        width="md"
                        name="remark"
                        label="备注"
                        placeholder="请输入备注"
                        fieldProps={{
                            maxLength: 100,
                        }}
                    />
                </ProForm.Group>
            </ModalForm>
        </div>
    );
};

export default VenueModalForm;
