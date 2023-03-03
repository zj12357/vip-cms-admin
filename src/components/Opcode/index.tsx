import React, {
    FC,
    useState,
    Fragment,
    useCallback,
    useMemo,
    memo,
    useEffect,
} from 'react';
import { message, Form, Input, Modal, Button, ButtonProps } from 'antd';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { ButtonItem } from '../AuthButton';
import { useHttp } from '@/hooks';
import { verifyOpcode } from '@/api/public';
import { VerifyOpcodeParams } from '@/types/api/public';
import DoubleModal from '../Opcode/DoubleModal';
import _ from 'lodash';

export type OpcodeProps = {
    trigger?: React.ReactNode; //opcode弹框dom，处理trigger元素不是Button类型
    childrenType?: 'modal' | 'text'; //子元素的类型
    btnInfo: ButtonItem; //按钮信息
    firstVisible?: boolean; //外层的父级弹窗

    verify?: (isVerify: boolean, auth: string) => void; //返回校验结果
    onClose?: () => void; //关闭回调
    buttonName?: string; //按钮名称
    buttonProps?: ButtonProps; //按钮参数
    isSecond?: boolean; //二次验证
    secondDom?: React.ReactNode; //二次验证dom
    secondVerify?: (isVerify: boolean) => void; //返回校验结果
    secondVisible?: boolean; //弹框显示
    secondOnClose?: () => void; //关闭回调
};

export type ChildrenProps = {
    visible?: boolean;
};

const Opcode: FC<OpcodeProps> = ({
    children,
    childrenType,
    btnInfo,
    onClose,
    verify,
    buttonName,
    buttonProps,
    trigger,
    firstVisible,
    isSecond,
    secondDom,
    secondVerify,
    secondVisible,
    secondOnClose,
}) => {
    const [visible, setVisible] = useState(false);

    const [childModalVisible, setChildModalVisible] = useState(false);
    const [childTextVisible, setChildTextVisible] = useState(false);
    const [doubleVisible, setDoubleVisible] = useState(false);
    const [opcodeRandomNum, setOpcodeRandomNum] = useState('');

    //处理验证弹框内容
    const handleModal = useCallback(() => {
        if (childrenType === 'modal') {
            setChildModalVisible(true);
        }
    }, [childrenType]);

    //处理文本内容
    const handleText = useCallback(() => {
        if (childrenType === 'text') {
            setChildTextVisible(true);
        }
    }, [childrenType]);

    const triggerDom = useMemo(() => {
        const buttonContent = React.Children.map(
            <Button></Button>,
            (item, index) => {
                return React.cloneElement(item, {
                    ...buttonProps,
                    children: buttonName,
                    key: index,
                    onClick: async (e: any) => {
                        setVisible(true);
                        buttonProps?.onClick?.(e);
                    },
                });
            },
        );
        const triggerContent = React.Children?.map(
            trigger,
            (item: any, index) => {
                return React.cloneElement(item, {
                    ...item.props,
                    key: index,
                    onClick: async (e: any) => {
                        setVisible(true);
                        item?.onClick?.(e);
                    },
                });
            },
        );

        return <div>{trigger ? triggerContent : buttonContent}</div>;
    }, [buttonName, buttonProps, trigger]);

    const { fetchData: _fetchVerifyOpcode } = useHttp<
        VerifyOpcodeParams,
        string
    >(verifyOpcode);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onFinish = async (values: any) => {
        let params: VerifyOpcodeParams = {
            m: btnInfo.menu_id,
            o: values.code,
        };

        const res = await _fetchVerifyOpcode(params);

        if (res.code === 10000) {
            const auth = res.data.split('|')?.[1];
            message.success('验证成功');
            handleCancel();
            verify?.(true, auth);
            handleModal();
            handleText();
            if (secondVisible === undefined) {
                setDoubleVisible(true);
            }
            //保存随机数
            if (isSecond) {
                setOpcodeRandomNum(res.data);
            }
        } else {
            verify?.(false, '');
        }
    };

    const handleCancel = useCallback(() => {
        setVisible(false);
        onClose?.();
    }, [onClose]);

    const handleDoubleCancel = useCallback(() => {
        if (secondVisible === undefined) {
            setDoubleVisible(false);
        } else {
            secondOnClose?.();
        }
    }, [secondOnClose, secondVisible]);

    const OpcodeModal = useMemo(() => {
        return (
            <ModalForm
                title="操作码"
                width={400}
                visible={visible}
                onFinish={onFinish}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        handleCancel();
                    },
                    zIndex: 1001,
                    maskClosable: false,
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
    }, [handleCancel, onFinish, visible]);

    //子组件是弹窗类型，向子组件传递visible属性
    const ModalTrigger: FC<ChildrenProps> = memo(({ visible }) => {
        const childContent = visible
            ? React.Children.map(children, (item: any, index) => {
                  return React.cloneElement(item, {
                      ...item.props,
                      key: index,
                      visible: visible,

                      onClose: () => {
                          setChildModalVisible(false);
                      },
                  });
              })
            : null;
        return <Fragment>{childContent}</Fragment>;
    });

    //子组件是文本之类的类型,验证通过显示内容
    const TextTrigger: FC<ChildrenProps> = memo(({ visible }) => {
        const childContent = visible
            ? React.Children.map(children, (item: any, index) => {
                  return React.cloneElement(item, {
                      ...item.props,
                      key: index,
                      visible: visible,

                      onClose: () => {
                          setChildTextVisible(false);
                      },
                  });
              })
            : null;

        return <Fragment>{childContent}</Fragment>;
    });

    useEffect(() => {
        if (firstVisible === false) {
            setOpcodeRandomNum('');
        }
    }, [firstVisible]);
    return (
        <div>
            {childrenType === 'modal' && (
                <ModalTrigger visible={childModalVisible}></ModalTrigger>
            )}
            {childrenType === 'text' && (
                <TextTrigger visible={childTextVisible}></TextTrigger>
            )}
            {triggerDom}

            {OpcodeModal}
            {isSecond && (
                <DoubleModal
                    secondDom={secondDom}
                    secondVisible={
                        secondVisible === undefined
                            ? doubleVisible
                            : secondVisible
                    }
                    onColse={handleDoubleCancel}
                    randomNum={opcodeRandomNum}
                    btnInfo={btnInfo}
                    secondVerify={secondVerify}
                ></DoubleModal>
            )}
        </div>
    );
};

export default Opcode;
