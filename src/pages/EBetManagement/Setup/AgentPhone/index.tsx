import React, {
    ComponentProps,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { AgentPhoneProps } from '@/types/api/eBet';
import { useHttp } from '@/hooks';
import { getAgentPhone, saveAgentPhone } from '@/api/eBet';
import { FormInstance } from 'antd/es';
import { message, Spin } from 'antd';

interface AgentPhonePageProps extends ComponentProps<any> {}

const AgentPhonePage: React.FC<AgentPhonePageProps> = () => {
    const formRef = useRef<FormInstance>();
    const [formData, setFormData] = useState<AgentPhoneProps>();
    const { fetchData: queryAgentPhone, loading } = useHttp(
        getAgentPhone,
        (res) => {
            if (res.code === 10000) {
                setFormData(res.data);
            }
        },
    );
    const { fetchData: updateAgentPhone } = useHttp(
        saveAgentPhone,
        async (res) => {
            if (res.code === 10000) {
                await queryAgentPhone();
                message.success('操作成功');
            }
        },
    );

    useEffect(() => {
        queryAgentPhone().then(() => formRef.current?.resetFields());
    }, [queryAgentPhone]);

    const handleFinish = useCallback(
        async (values: AgentPhoneProps) => {
            await updateAgentPhone({
                ...values,
                id: formData?.id,
            });
            return true;
        },
        [formData?.id, updateAgentPhone],
    );

    return (
        <Spin spinning={loading}>
            <ProForm<AgentPhoneProps>
                key={JSON.stringify(formData)}
                layout={'horizontal'}
                submitter={{ searchConfig: { submitText: '保存' } }}
                onFinish={handleFinish}
                formRef={formRef}
            >
                <div>
                    <div
                        style={{
                            fontWeight: 'bold',
                            fontSize: 18,
                            marginBottom: 10,
                        }}
                    >
                        代理热线电话配置
                    </div>
                    <div>
                        <ProFormText
                            width="md"
                            name="agent_hotline1"
                            label="热线电话1"
                            placeholder="请输入"
                            initialValue={formData?.hotline1}
                            colon={false}
                            getValueFromEvent={(e) =>
                                e.target.value?.replace(/[^0-9-+]+/g, '')
                            }
                            rules={[
                                {
                                    validator: async (_, value) => {
                                        if (
                                            value &&
                                            (value.indexOf?.('+') > 0 ||
                                                value.split?.('-').length > 2)
                                        ) {
                                            return Promise.reject(
                                                '请输入正确的电话号码',
                                            );
                                        }
                                        return Promise.resolve(true);
                                    },
                                },
                            ]}
                        />
                        <ProFormText
                            width="md"
                            name="agent_hotline2"
                            label="热线电话2"
                            placeholder="请输入"
                            initialValue={formData?.hotline2}
                            colon={false}
                            getValueFromEvent={(e) =>
                                e.target.value?.replace(/[^0-9-+]+/g, '')
                            }
                            rules={[
                                {
                                    validator: async (_, value) => {
                                        if (
                                            value &&
                                            (value.indexOf?.('+') > 0 ||
                                                value.split?.('-').length > 2)
                                        ) {
                                            return Promise.reject(
                                                '请输入正确的电话号码',
                                            );
                                        }
                                        return Promise.resolve(true);
                                    },
                                },
                            ]}
                        />
                    </div>
                </div>
                <div>
                    <div
                        style={{
                            fontWeight: 'bold',
                            fontSize: 18,
                            marginBottom: 10,
                        }}
                    >
                        游戏端热线电话配置
                    </div>
                    <div>
                        <ProFormText
                            width="md"
                            name="game_hotline1"
                            label="热线电话1"
                            placeholder="请输入"
                            initialValue={formData?.['game-hotline1']}
                            colon={false}
                            getValueFromEvent={(e) =>
                                e.target.value?.replace(/[^0-9-+]+/g, '')
                            }
                            rules={[
                                {
                                    validator: async (_, value) => {
                                        if (
                                            value &&
                                            (value.indexOf?.('+') > 0 ||
                                                value.split?.('-').length > 2)
                                        ) {
                                            return Promise.reject(
                                                '请输入正确的电话号码',
                                            );
                                        }
                                        return Promise.resolve(true);
                                    },
                                },
                            ]}
                        />
                        <ProFormText
                            width="md"
                            name="game_hotline2"
                            label="热线电话2"
                            placeholder="请输入"
                            initialValue={formData?.['game-hotline2']}
                            colon={false}
                            getValueFromEvent={(e) =>
                                e.target.value?.replace(/[^0-9-+]+/g, '')
                            }
                            rules={[
                                {
                                    validator: async (_, value) => {
                                        if (
                                            value &&
                                            (value.indexOf?.('+') > 0 ||
                                                value.split?.('-').length > 2)
                                        ) {
                                            return Promise.reject(
                                                '请输入正确的电话号码',
                                            );
                                        }
                                        return Promise.resolve(true);
                                    },
                                },
                            ]}
                        />
                    </div>
                </div>
            </ProForm>
        </Spin>
    );
};

export default AgentPhonePage;
