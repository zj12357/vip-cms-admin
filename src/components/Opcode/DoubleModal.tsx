import React, { FC, useState, useEffect, useMemo } from 'react';
import { Modal } from 'antd';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { verifyOpcode } from '@/api/public';
import { VerifyOpcodeParams } from '@/types/api/public';
import { useHttp } from '@/hooks';
import { ButtonItem } from '../AuthButton';

type DoubleModalProps = {
    btnInfo: ButtonItem; //按钮信息
    firstVisible?: boolean; //外层的父级弹窗

    onColse?: () => void; //关闭弹窗回调
    secondVisible?: boolean; //弹框显示
    secondDom?: React.ReactNode; //二次验证dom
    randomNum?: string; //随机数
    secondVerify?: (isVerify: boolean) => void; //返回校验结果
};

const DoubleModal: FC<DoubleModalProps> = ({
    secondVisible,
    onColse,
    secondDom,
    randomNum,
    btnInfo,
    secondVerify,
}) => {
    const [visible, setVisible] = useState(false);

    const { fetchData: _fetchVerifyOpcode } = useHttp<
        VerifyOpcodeParams,
        string
    >(verifyOpcode);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onFinish = async (values: any) => {
        let params: VerifyOpcodeParams = {
            m: btnInfo.menu_id,
            o: values.code,
            s: randomNum,
        };

        const res = await _fetchVerifyOpcode(params);

        if (res.code === 10000) {
            secondVerify?.(true);
            setVisible(false);
            onColse?.();
        } else {
            secondVerify?.(false);
        }
    };

    const OpcodeModal = useMemo(() => {
        return (
            <ModalForm
                title="操作码"
                width={400}
                onFinish={onFinish}
                visible={visible}
                modalProps={{
                    onCancel: () => {
                        setVisible(false);
                    },
                }}
                isKeyPressSubmit
            >
                <ProForm.Group>
                    <ProFormText.Password
                        width="md"
                        name="code"
                        label="操作码"
                        placeholder="请输入操作码"
                        rules={[
                            {
                                required: true,
                                message: '请输入操作码',
                            },
                        ]}
                        fieldProps={{
                            maxLength: 4,
                            visibilityToggle: false,
                        }}
                    />
                </ProForm.Group>
            </ModalForm>
        );
    }, [onFinish, visible]);

    return (
        <>
            <Modal
                title="信息确认"
                visible={secondVisible}
                zIndex={1000}
                destroyOnClose={true}
                maskClosable={false}
                onOk={() => setVisible(true)}
                onCancel={onColse}
            >
                {secondDom}
            </Modal>
            {visible && OpcodeModal}
        </>
    );
};

export default DoubleModal;
