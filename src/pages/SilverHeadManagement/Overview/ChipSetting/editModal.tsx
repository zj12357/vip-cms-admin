/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState, useRef, useEffect } from 'react';
import { ModalForm, ProFormSelect } from '@ant-design/pro-components';
import { useAppSelector } from '@/store/hooks';
import { useHttp } from '@/hooks';
import {
    selectCurrencyList,
    selectChipsList,
} from '@/store/common/commonSlice';
import type { ProFormInstance } from '@ant-design/pro-components';
import { editChipSetting } from '@/api/silverHead';
import './index.scoped.scss';
import { admissionType, shareType, workType } from '@/common/commonConstType';
import AuthButton from '@/components/AuthButton';
import { Descriptions } from 'antd';

type Props = {
    record?: any;
    onSuccess: () => void;
};

const principalType = [
    { label: 'A(台面)', value: 'A(台面)' },
    { label: 'B(台底)', value: 'B(台底)' },
    { label: 'B(台面)', value: 'B(台面)' },
    { label: 'B(台底)', value: 'B(台底)' },
];
const EditdModal: FC<Props> = (props) => {
    const [isPass, setIsPass] = useState(false);
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数
    const [chipsListSelect, setChipsListSelect] = useState<any>([]);
    const { fetchData: fetchEditChipSetting } = useHttp<any, any[]>(
        editChipSetting,
    );

    const currencyList = useAppSelector(selectCurrencyList);
    const chipsList = useAppSelector(selectChipsList);
    const { onSuccess, record } = props;

    const formRef = useRef<ProFormInstance>();
    useEffect(() => {
        setChipsListSelect(chipsList);
    }, [isPass]);
    const getLabel = (list: any[], id: number) => {
        return list.find((i) => i.value === id)?.label || '';
    };

    const onFinish = async (values: any) => {
        const params = {
            ...values,
            id: values.chips_id,
            tag_id: record.tag_id,
        };

        setDoubleParams(params);
        setDoubleVisible(true);
    };

    const handleDoubleSuccess = async () => {
        const res = await fetchEditChipSetting({
            id: doubleParams.id,
            tag_id: doubleParams.tag_id,
        });
        if (res.code === 10000) {
            onSuccess();
            setIsPass(false);
            setDoubleVisible(false);
            setDoubleParams({});
        }
    };

    const getChipsName = (ids: any[]) => {
        return chipsList
            .filter((i) => ids.findIndex((id) => id === i.value) !== -1)
            .map((i) => i.label)
            .join('，');
    };
    return (
        <ModalForm
            modalProps={{
                destroyOnClose: true,
            }}
            visible={isPass}
            onVisibleChange={(visible) => {
                setIsPass(visible);
            }}
            formRef={formRef}
            initialValues={{
                ...record,
                currency_id: record.currency_id || '',
                chips_id: (record.chips_list || []).map((i: any) => i.id),
            }}
            trigger={
                <AuthButton
                    normal={'chipSetting-edit'}
                    verify={(pass) => {
                        setIsPass(pass);
                    }}
                    trigger={
                        <span className="m-primary-font-color pointer">
                            调整
                        </span>
                    }
                    firstVisible={isPass}
                    isSecond={true}
                    secondDom={
                        <Descriptions column={24}>
                            <Descriptions.Item label="开工币种" span={12}>
                                {getLabel(currencyList, record.currency_id)}
                            </Descriptions.Item>
                            <Descriptions.Item label="入场类型" span={12}>
                                {getLabel(admissionType, doubleParams.use_for)}
                            </Descriptions.Item>
                            <Descriptions.Item label="开工类型" span={12}>
                                {doubleParams.mode}
                            </Descriptions.Item>
                            <Descriptions.Item label="本金类型" span={12}>
                                {getLabel(shareType, doubleParams.capital_type)}
                            </Descriptions.Item>
                            <Descriptions.Item label="筹码名称调整为" span={18}>
                                {getChipsName(doubleParams.chips_id || [])}
                            </Descriptions.Item>
                        </Descriptions>
                    }
                    secondVerify={(val) => {
                        if (val) {
                            handleDoubleSuccess();
                        }
                    }}
                    secondVisible={doubleVisible}
                    secondOnClose={() => setDoubleVisible(false)}
                ></AuthButton>
            }
            title={'调整筹码'}
            layout="horizontal"
            grid
            onFinish={onFinish}
            submitter={{
                searchConfig: {
                    resetText: '关闭',
                    submitText: '确认',
                },
            }}
        >
            <ProFormSelect
                name="currency_id"
                label="开工币种"
                disabled
                options={currencyList}
                colProps={{
                    md: 12,
                    xl: 12,
                    xs: 12,
                }}
                rules={[{ required: true }]}
            />
            <ProFormSelect
                name="use_for"
                label="入场类型"
                disabled
                options={admissionType}
                rules={[{ required: true }]}
                colProps={{
                    md: 12,
                    xl: 12,
                    xs: 12,
                }}
            />
            <ProFormSelect
                name="mode"
                label="开工类型"
                disabled
                options={workType}
                rules={[{ required: true }]}
                colProps={{
                    md: 12,
                    xl: 12,
                    xs: 12,
                }}
            />
            <ProFormSelect
                disabled
                name="capital_type"
                label="本金类型"
                options={shareType}
                rules={[{ required: true }]}
                colProps={{
                    md: 12,
                    xl: 12,
                    xs: 12,
                }}
            />
            <ProFormSelect
                name="use_type"
                disabled
                label="出码类型"
                options={principalType}
                rules={[{ required: true }]}
                colProps={{
                    md: 12,
                    xl: 12,
                    xs: 12,
                }}
            />
            <ProFormSelect
                options={chipsListSelect}
                mode="multiple"
                name="chips_id"
                label="筹码名称"
                rules={[{ required: true }]}
                colProps={{
                    md: 12,
                    xl: 12,
                    xs: 12,
                }}
            />
        </ModalForm>
    );
};

export default EditdModal;
