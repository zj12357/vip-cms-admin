import React, { FC, useState } from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { message, Modal } from 'antd';
import { isInteger } from '@/utils/validate';
import { useHttp } from '@/hooks';
import { userUpdatePassWord } from '@/api/user';
import { UserUpdatePassWordParams } from '@/types/api/user';
import './index.scoped.scss';

type SetOpcodeProps = {
    trigger: JSX.Element;
};

const SetOpcode: FC<SetOpcodeProps> = ({ trigger }) => {
    const [visible, setVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [opcode, setOpcode] = useState('');
    const { fetchData: _fetchUserUpdatePassWord } = useHttp<
        UserUpdatePassWordParams,
        null | string
    >(userUpdatePassWord);

    const handleUserUpdatePassWord = async () => {
        const res = await _fetchUserUpdatePassWord({
            type: 2,
        });
        if (res.code === 10000) {
            message.success(res.msg);
            setVisible(true);
            setOpcode(res.data ?? '');
        }
    };

    return (
        <div>
            <Modal
                title="重置操作码"
                onOk={() => {
                    setConfirmVisible(false);
                    handleUserUpdatePassWord();
                }}
                onCancel={() => {
                    setConfirmVisible(false);
                }}
                visible={confirmVisible}
                width={300}
            >
                <p>确定需要重置操作码吗？</p>
            </Modal>
            <ModalForm
                trigger={
                    <div onClick={() => setConfirmVisible(true)}>{trigger}</div>
                }
                title="操作码"
                style={{
                    maxHeight: '70vh',
                    overflowY: 'auto',
                }}
                modalProps={{
                    destroyOnClose: true,
                    onCancel: () => {
                        setVisible(false);
                    },
                }}
                width={300}
                visible={visible}
                submitter={false}
            >
                <div className="opcode-box">{opcode}</div>
            </ModalForm>
        </div>
    );
};

export default SetOpcode;
