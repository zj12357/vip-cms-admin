import React, { FC, useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import {
    selectCurrentHall,
    selectCurrencyList,
} from '@/store/common/commonSlice';
import {
    ProFormText,
    ModalForm,
    ProFormSelect,
} from '@ant-design/pro-components';
import AuthButton from '@/components/AuthButton';
import { addChip, editChip } from '@/api/silverHead';
import { ChipManageItem } from '@/types/api/silverHead';
import './index.scoped.scss';
import { Descriptions, message } from 'antd';

type Props = {
    record?: ChipManageItem;
    type?: number; // 默认为新增 1为编辑
    onSuccess: () => void;
};
interface Data {
    label: string;
    value: number;
}
const EditdModal: FC<Props> = (props) => {
    const [isPass, setIsPass] = useState(false);
    const [doubleVisible, setDoubleVisible] = useState(false); //二次验证
    const [doubleParams, setDoubleParams] = useState<any>({}); //二次验证的表单参数
    const currentHall = useAppSelector(selectCurrentHall);
    const currencyList = useAppSelector(selectCurrencyList);
    const { type, record, onSuccess } = props;

    const getLabel = (data: Array<Data>, value: number) => {
        return data.find((item) => item.value === value)?.label;
    };
    const onFinish = async (values: any) => {
        const params: any = {
            ...record,
            ...values,
            hall_id: currentHall?.id,
            hall_name: currentHall?.hall_name,
        };
        if (type === 1) {
            params.edit_name = params.chips_name;
            params.chips_name = record?.chips_name;
        }
        setDoubleParams(params);
        setDoubleVisible(true);
    };

    const handleDoubleSuccess = async () => {
        const fun = type === 1 ? editChip : addChip;
        const res = await fun(doubleParams);
        if (res.code === 10000) {
            onSuccess();
            message.success('提交成功');
            setIsPass(false);
            setDoubleVisible(false);
            setDoubleParams({});
        }
    };
    useEffect(() => {
        if (!isPass) {
            setDoubleParams({});
        }
    }, [isPass]);
    return (
        <ModalForm
            visible={isPass}
            width={400}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            trigger={
                <AuthButton
                    normal={`chipManagement-${type === 1 ? 'edit' : 'add'}`}
                    verify={(pass) => {
                        setIsPass(pass);
                    }}
                    buttonProps={{
                        type: 'primary',
                    }}
                    trigger={
                        type === 1 ? (
                            <span className="m-primary-font-color pointer">
                                编辑
                            </span>
                        ) : (
                            ''
                        )
                    }
                    firstVisible={isPass}
                    isSecond={true}
                    secondDom={
                        <Descriptions column={24}>
                            <Descriptions.Item label="场馆" span={12}>
                                {currentHall.hall_name}
                            </Descriptions.Item>
                            <Descriptions.Item label="币种代码" span={12}>
                                {getLabel(
                                    currencyList,
                                    doubleParams.currency_id,
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="筹码名称" span={12}>
                                {doubleParams.chips_name}
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
            onVisibleChange={(val) => {
                setIsPass(val);
            }}
            initialValues={{ ...record, hall_name: currentHall?.hall_name }}
            title={type === 1 ? '编辑筹码' : '新增筹码'}
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
            <ProFormText name="hall_name" label="场馆" disabled />
            <ProFormSelect
                name="currency_id"
                label="币种代码"
                options={currencyList}
                rules={[{ required: true }]}
            />
            <ProFormText
                name="chips_name"
                label="筹码名称"
                rules={[{ required: true }]}
            />
        </ModalForm>
    );
};

export default EditdModal;
