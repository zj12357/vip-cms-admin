import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    ModalForm,
    ProFormTextArea,
    ProFormRadio,
} from '@ant-design/pro-components';
import { FormInstance } from 'antd/es';
import { message, Row, Spin } from 'antd';
import { useHttp } from '@/hooks';
import { getMemberSendMethod } from '@/api/communication';
import { MemberPhoneInfo } from '@/types/api/communication';
import { phoneLanguageType } from '@/common/commonConstType';
import { languages } from '@/pages/Communication/SMS/common';

interface SelectAccountModalProps {
    trigger: JSX.Element;
    onChange?: (values: any) => void;
    loadData?: (values: MemberPhoneInfo[]) => void;
    data?: MemberPhoneInfo[];
}

const options = [
    {
        value: 0,
        label: '自定义',
    },
    {
        value: 1,
        label: '全部',
    },
];

const SelectAccountModal: React.FC<SelectAccountModalProps> = ({
    trigger,
    onChange,
    loadData,
    data,
}) => {
    const formRef = useRef<FormInstance>();
    const { fetchData: queryMemberSendMethod, response: memberSendResp } =
        useHttp(getMemberSendMethod, (res) => {
            loadData?.(res.data);
        });
    const [formValues, setFormValues] = useState<Record<string, any>>({}); // 触发页面状态更新
    const [loading, setLoading] = useState<boolean>(false);
    const [initValues, setInitValues] = useState<Record<string, any>>({});

    // 数据清洗分类
    const classify = useMemo(() => {
        const list = data
            ?.filter((m) => String(m.sending_method).indexOf('3') !== -1) // 支持发送短息
            .map((m) => ({
                ...m,
                language: languages.find((p) => p.key === m.language)?.value,
            }));
        const all = list
            ?.map((m) => ({
                mobile_number: m.telephone,
                language: m.language,
            }))
            .reduce<any>((prev, current, items) => {
                if (
                    prev.findIndex(
                        (p: any) => p.mobile_number === current.mobile_number,
                    ) >= 0
                ) {
                    return prev;
                }
                return [...prev, current];
            }, []);
        const memberNumbers = Array.from(
            new Set(list?.map((m) => m.member_code)),
        );
        const authorIds = Array.from(
            new Set(list?.map((m) => m.authorizer_id)),
        );
        return {
            all,
            memberNumbers,
            authorIds,
            type: initValues.type,
        };
    }, [data, initValues.type]);

    const handleFinish = useCallback(
        async (values: Record<string, any>) => {
            if (!+values.type && !values.member_code) {
                message.error('请补充户口信息');
                return false;
            }
            setLoading(true);
            // 根据户口号获取电话号码
            queryMemberSendMethod({
                member_code: values.member_code,
            }).finally(() => {
                setLoading(false);
            });
            return true;
        },
        [queryMemberSendMethod],
    );

    useEffect(() => {
        onChange?.({ all: classify.all, type: initValues.type });
    }, [classify.all, initValues.type, onChange]);

    return (
        <>
            <ModalForm
                formRef={formRef}
                title={'发送户口'}
                trigger={trigger}
                onFinish={handleFinish}
                onValuesChange={(values) =>
                    setFormValues({
                        ...formValues,
                        ...values,
                    })
                }
                modalProps={{
                    maskClosable: false,
                }}
                onVisibleChange={() => {
                    setInitValues(formValues);
                    setTimeout(() => {
                        formRef.current?.setFieldsValue(formValues);
                    }, 200);
                }}
                formKey={JSON.stringify(initValues)}
            >
                <ProFormRadio.Group
                    name={'type'}
                    options={options}
                    initialValue={initValues.type}
                    getValueFromEvent={(e) => {
                        formRef.current?.setFieldsValue({
                            member_code: '',
                        });
                        return e.target.value;
                    }}
                />
                <ProFormTextArea
                    name={'member_code'}
                    fieldProps={{ rows: 6 }}
                    initialValue={initValues.member_code}
                    hidden={formRef.current?.getFieldValue('type') !== 0}
                    dependencies={['type']}
                />
            </ModalForm>
            <Spin spinning={loading}>
                <Row
                    justify={'space-between'}
                    align={'middle'}
                    style={{
                        padding: '10px 18px',
                        border: '1px solid #f0f0f0',
                        borderRadius: 4,
                        minHeight: 150,
                        marginTop: 15,
                    }}
                >
                    <Row align={'middle'} style={{ flexDirection: 'column' }}>
                        <div style={{ marginBottom: 20 }}>所有号码</div>
                        <div>{classify.all?.length ?? 0}</div>
                    </Row>
                    <Row align={'middle'} style={{ flexDirection: 'column' }}>
                        <div style={{ marginBottom: 20 }}>户口号码</div>
                        <div>{classify.memberNumbers?.length ?? 0}</div>
                    </Row>
                    <Row align={'middle'} style={{ flexDirection: 'column' }}>
                        <div style={{ marginBottom: 20 }}>授权人号码</div>
                        <div>{classify.authorIds?.length}</div>
                    </Row>
                </Row>
            </Spin>
        </>
    );
};

export default SelectAccountModal;
