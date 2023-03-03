import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useHttp } from '@/hooks';
import { limitDeskList, limitDeskUpdate } from '@/api/eBet';
import {
    ProForm,
    ProFormSelect,
    ProFormInstance,
    ProFormDigit,
} from '@ant-design/pro-components';
import { LimitDeskProps } from '@/types/api/eBet';
import { Col, message, Row, Spin } from 'antd';
import { useVipClub } from '@/pages/EBetManagement/common/hooks';

type DeskLimitPageProps = {};

const DeskLimitPage: React.FC<DeskLimitPageProps> = () => {
    const headFormRef = useRef<ProFormInstance>();
    const contentFormRef = useRef<ProFormInstance>();
    const [deskId, setDeskId] = useState<number>();
    const [formData, setFormData] = useState<LimitDeskProps>();
    const { fetchData: getLimitDesk, loading } = useHttp(limitDeskList);
    const { fetchData: updateLimitDesk } = useHttp(limitDeskUpdate, (res) => {
        if (res.code === 10000) {
            message.success('保存成功');
        }
    });

    const {
        clubOptions,
        deskOptions,
        clubId,
        setClubId,
        clubLoading,
        deskLoading,
    } = useVipClub();

    const betTypes = useMemo(
        () => [
            {
                value: 1,
                label: '庄/闲',
                min: 5000,
                max: 1000000,
            },
            {
                value: 2,
                label: '和',
                min: 500,
                max: 125000,
            },
            {
                value: 3,
                label: '对子',
                min: 500,
                max: 90000,
            },
        ],
        [],
    );

    const getLimitDeskData = useCallback(
        (deskId: number) => {
            getLimitDesk({
                desk_id: deskId,
            }).then((res) => {
                const result = res.data ?? {};
                // 组装数据
                const limit_array = betTypes.map((bt) => {
                    const data =
                        result.limit_array?.find?.(
                            (a) => String(a.bet_type) === String(bt.value),
                        ) ?? {};
                    return {
                        ...bt,
                        values: data,
                    };
                });
                const entity = {
                    id: result.id,
                    type: result.type,
                    desk_id: result.desk_id || deskId,
                    limit_array,
                };
                setFormData(entity);
            });
        },
        [betTypes, getLimitDesk],
    );

    useEffect(() => {
        if (deskId) {
            getLimitDeskData(deskId);
        }
    }, [deskId, getLimitDeskData]);

    const handleFinish = useCallback(
        async (values: any) => {
            const payload = {
                ...formData,
            };
            const limit_array = formData?.limit_array?.map((la) => {
                const minKey = `min_amount$${la.value}`;
                const maxKey = `max_amount$${la.value}`;
                const data = {
                    bet_type: la.value,
                    min_amount: values[minKey],
                    max_amount: values[maxKey],
                };
                return data;
            });
            Object.assign(payload, {
                limit_array,
            });
            await updateLimitDesk(payload);
            if (deskId) {
                getLimitDeskData(deskId);
            }
            return true;
        },
        [deskId, formData, getLimitDeskData, updateLimitDesk],
    );

    return (
        <div>
            <div style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 15 }}>
                桌台限红
            </div>
            <ProForm
                formRef={headFormRef}
                layout={'horizontal'}
                colon={false}
                labelCol={{ span: 2 }}
                submitter={false}
            >
                <ProFormSelect
                    width={'md'}
                    name={'club_id'}
                    label={'贵宾厅'}
                    options={clubOptions}
                    getValueFromEvent={(value) => {
                        setClubId(value);
                        setDeskId(undefined);
                        headFormRef?.current?.resetFields(['desk_id']);
                        return value;
                    }}
                    fieldProps={{
                        loading: clubLoading,
                    }}
                />
                <ProFormSelect
                    width={'md'}
                    name={'desk_id'}
                    label={'桌台'}
                    options={deskOptions}
                    getValueFromEvent={(value) => {
                        setDeskId(value);
                        contentFormRef?.current?.resetFields();
                        return value;
                    }}
                    fieldProps={{
                        loading: deskLoading,
                    }}
                />
            </ProForm>
            <ProForm
                key={JSON.stringify(formData)}
                formRef={contentFormRef}
                layout={'horizontal'}
                colon={false}
                labelCol={{ span: 2 }}
                hidden={!headFormRef?.current?.getFieldValue('desk_id')}
                onFinish={handleFinish}
            >
                <Spin spinning={loading}>
                    <div
                        style={{
                            border: '1px solid #f0f0f0',
                            borderRadius: 8,
                            padding: 8,
                            marginBottom: 20,
                        }}
                    >
                        <Row gutter={2}>
                            <Col span={2}></Col>
                            <Col
                                span={10}
                                style={{
                                    textAlign: 'center',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    maxWidth: 550,
                                }}
                            >
                                最低
                            </Col>
                            <Col span={2}></Col>
                            <Col
                                span={10}
                                style={{
                                    textAlign: 'center',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                }}
                            >
                                最高
                            </Col>
                        </Row>
                        {formData?.limit_array?.map((bt) => (
                            <Row key={bt?.value} gutter={2}>
                                <Col
                                    span={2}
                                    style={{
                                        marginTop: 5,
                                        textAlign: 'right',
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    <span>{bt?.label}</span>
                                </Col>
                                <Col span={10}>
                                    <ProFormDigit
                                        name={`min_amount$${bt.value}`}
                                        labelCol={{ span: 4 }}
                                        width={'md'}
                                        label={bt.min}
                                        min={bt.min}
                                        max={bt.max}
                                        initialValue={bt.values?.min_amount}
                                        dependencies={[
                                            `max_amount$${bt.value}`,
                                        ]}
                                        validateFirst={true}
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入金额',
                                            },
                                            {
                                                validator: async (_, value) => {
                                                    if (+bt.min > +value) {
                                                        return Promise.reject(
                                                            `金额不能低于${bt.min}`,
                                                        );
                                                    }
                                                    if (
                                                        value &&
                                                        +value >
                                                            +contentFormRef.current?.getFieldValue(
                                                                `max_amount$${bt.value}`,
                                                            )
                                                    ) {
                                                        return Promise.reject(
                                                            '最低金额不应高于最高金额',
                                                        );
                                                    }
                                                    return true;
                                                },
                                            },
                                        ]}
                                        required={false}
                                    />
                                </Col>
                                <Col span={2}>~</Col>
                                <Col span={10}>
                                    <ProFormDigit
                                        name={`max_amount$${bt.value}`}
                                        labelCol={{ span: 4 }}
                                        width={'md'}
                                        label={bt.max}
                                        min={bt.min}
                                        max={bt.max}
                                        initialValue={bt.values?.max_amount}
                                        dependencies={[
                                            `min_amount$${bt.value}`,
                                        ]}
                                        validateFirst={true}
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入金额',
                                            },
                                            {
                                                validator: async (_, value) => {
                                                    if (+bt.max < +value) {
                                                        return Promise.reject(
                                                            `金额不能高于${bt.max}`,
                                                        );
                                                    }
                                                    if (
                                                        value &&
                                                        +value <
                                                            +contentFormRef.current?.getFieldValue(
                                                                `min_amount$${bt.value}`,
                                                            )
                                                    ) {
                                                        return Promise.reject(
                                                            '最高金额不应低于最低金额',
                                                        );
                                                    }
                                                    return true;
                                                },
                                            },
                                        ]}
                                        required={false}
                                    />
                                </Col>
                            </Row>
                        ))}
                    </div>
                </Spin>
            </ProForm>
        </div>
    );
};

export default DeskLimitPage;
