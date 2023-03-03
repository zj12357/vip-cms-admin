import React, { FC } from 'react';
import {
    ModalForm,
    ProFormText,
    ProFormDigit,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { useHttp, useLatest } from '@/hooks';
import { updateCreditCfg } from '@/api/system';
import {
    UpdateCreditCfgParams,
    GetCreditCfgListItem,
} from '@/types/api/system';
import { checkFormItemValue } from '@/common/commonHandle';

type CreditCfgModalFormProps = {
    trigger: JSX.Element;
    type: 'add' | 'edit';
    reloadData: () => void;
    record: GetCreditCfgListItem;
};

const CreditCfgModalForm: FC<CreditCfgModalFormProps> = ({
    trigger,
    type,
    reloadData,
    record,
}) => {
    const identityTitle: Record<string, string> = {
        add: '新增配置',
        edit: '调整信贷基数',
    };

    const updatedValues = useLatest({
        marker_type_name: checkFormItemValue(record.marker_type_name ?? 0),
        expired_day: checkFormItemValue(record.expired_day ?? 0),
        rate: checkFormItemValue(Number(record.rate) * 100 ?? 0),
    }).current;

    const { fetchData: _fetchUpdateCreditCfg } = useHttp<
        UpdateCreditCfgParams,
        null
    >(updateCreditCfg, ({ msg }) => {
        message.success(msg);
        reloadData();
    });

    const handleCreditCfg = (values: any) => {
        const commonParams = {
            expired_day: values.expired_day,
            rate: (values.rate / 100).toFixed(4),
        };
        if (type === 'edit') {
            return _fetchUpdateCreditCfg({
                ...commonParams,
                id: record?.id ?? 0,
            });
        }
    };

    return (
        <div>
            <ModalForm
                trigger={trigger}
                onFinish={async (values: any) => {
                    let res = await handleCreditCfg(values);
                    if (res?.code === 10000) {
                        return true;
                    }
                }}
                title={identityTitle[type]}
                style={{
                    maxHeight: '50vh',
                    overflowY: 'auto',
                    paddingLeft: '50px',
                }}
                modalProps={{
                    destroyOnClose: true,
                }}
                initialValues={updatedValues}
                request={async () => {
                    return Promise.resolve({
                        success: true,
                    });
                }}
                width={500}
            >
                <ProFormText
                    width="md"
                    name="marker_type_name"
                    label="信贷类型"
                    placeholder="-"
                    disabled={true}
                />
                <ProFormDigit
                    width="md"
                    name="expired_day"
                    label="过期天数"
                    placeholder="请输入"
                    rules={[
                        {
                            required: true,
                            message: '请输入过期天数',
                        },
                    ]}
                    addonAfter="天"
                />
                <ProFormDigit
                    width="md"
                    name="rate"
                    label="罚息率"
                    placeholder="请输入"
                    min={0}
                    fieldProps={{ precision: 2 }}
                    rules={[
                        {
                            required: true,
                            message: '请输入罚息率',
                        },
                    ]}
                    addonAfter="%"
                />
            </ModalForm>
        </div>
    );
};

export default CreditCfgModalForm;
