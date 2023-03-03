import React, { FC, useState } from 'react';
import { ModalForm } from '@ant-design/pro-components';
import './index.scoped.scss';

type OpcodeProps = {
    opcode: string;
    opcodeVisible: boolean;
    handleOpcodeVisible: (visible: boolean) => void;
};

const Opcode: FC<OpcodeProps> = ({
    opcode,
    handleOpcodeVisible,
    opcodeVisible,
}) => {
    return (
        <ModalForm
            title="操作码"
            style={{
                maxHeight: '70vh',
                overflowY: 'auto',
            }}
            modalProps={{
                destroyOnClose: true,
                onCancel: () => {
                    handleOpcodeVisible(false);
                },
            }}
            width={300}
            visible={opcodeVisible}
            submitter={false}
        >
            <div className="opcode-box">{opcode}</div>
        </ModalForm>
    );
};

export default Opcode;
