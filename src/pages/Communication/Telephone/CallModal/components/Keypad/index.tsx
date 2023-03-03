import React, {
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import './index.scoped.scss';
import { Button, Col, Modal, Row } from 'antd';
import {
    PhoneOutlined,
    DownOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

interface KeypadProps extends React.ComponentProps<any> {
    trigger?: ReactNode;
    onCall?: (phone: string | number) => Promise<any>;
}

const Keypad: React.FC<KeypadProps> = ({ trigger, onCall }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [code, setCode] = useState<string>('');
    const [bounds, setBounds] = useState({
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    });
    const dragRef = useRef<HTMLDivElement>(null);
    const keys = useMemo(
        () => [
            ...Array.from({ length: 9 }).map((_, i) => String(i + 1)),
            '*',
            '0',
            '#',
            '-',
        ],
        [],
    );

    const handleClick = useCallback(() => {
        setOpen(true);
    }, []);

    const addCode = useCallback(
        (key: string) => {
            if (keys.includes(key)) {
                setCode(code + key);
            }
        },
        [code, keys],
    );

    const keyup = useCallback(
        (e: KeyboardEvent) => {
            const key = e.key;
            if (key === 'Backspace') {
                setCode(code.substring(0, code.length - 1));
            }
            if (key === 'Delete') {
                setCode(code.substring(1, code.length));
            }
            addCode(key);
        },
        [addCode, code],
    );

    useEffect(() => {
        document.body.removeEventListener('keyup', keyup, false);
        if (open) {
            document.body.onkeyup = keyup;
        }
    }, [keyup, open]);

    const onStart = useCallback(
        (_event: DraggableEvent, uiData: DraggableData) => {
            const { clientWidth, clientHeight } = document.documentElement;
            const targetRect = dragRef.current?.getBoundingClientRect();
            if (!targetRect) {
                return;
            }
            setBounds({
                left: -targetRect.left + uiData.x,
                right: clientWidth - (targetRect.right - uiData.x),
                top: -targetRect.top + uiData.y,
                bottom: clientHeight - (targetRect.bottom - uiData.y),
            });
        },
        [],
    );

    return (
        <>
            <span onClick={handleClick}>{trigger}</span>
            <Modal
                visible={open}
                mask={false}
                className="keypad-container"
                wrapClassName="call-modal-inner-wrap"
                footer={false}
                closable={false}
                bodyStyle={{ padding: 0 }}
                modalRender={(modal) => (
                    <Draggable
                        handle={'.header'}
                        bounds={bounds}
                        onStart={(event, uiData) => onStart(event, uiData)}
                    >
                        <div ref={dragRef}>{modal}</div>
                    </Draggable>
                )}
            >
                <div className="keypad">
                    <Row
                        justify="space-between"
                        align="middle"
                        className="header"
                    >
                        <span>外线拨号器</span>
                        <span>空闲</span>
                    </Row>
                    <Row
                        align="middle"
                        justify="end"
                        className="display-content"
                    >
                        {code}
                    </Row>
                    <Row gutter={[15, 18]} className="keyboard">
                        {keys.map((k) => (
                            <Col key={k} span={8}>
                                <Button
                                    className="key-btn"
                                    type="primary"
                                    size="large"
                                    shape="round"
                                    block
                                    onClick={() => addCode(k)}
                                >
                                    {k}
                                </Button>
                            </Col>
                        ))}
                    </Row>
                    <Row align="middle" className="footer">
                        <Col span={7}>
                            <Button
                                className="close-btn"
                                icon={<DownOutlined />}
                                shape="round"
                                ghost
                                onClick={() => setOpen(false)}
                                size="large"
                            />
                        </Col>
                        <Col span={12}>
                            <Button
                                className="call-btn"
                                icon={<PhoneOutlined />}
                                type="primary"
                                shape="round"
                                block
                                size="large"
                                onClick={() => {
                                    if (onCall?.(code)) {
                                        setOpen(false);
                                    }
                                }}
                            >
                                呼叫
                            </Button>
                        </Col>
                        <Col span={5}>
                            <CloseCircleOutlined
                                style={{
                                    fontSize: '28px',
                                    marginLeft: '15px',
                                    opacity: 0.8,
                                }}
                                onClick={() => setCode(code.slice(0, -1))}
                            />
                        </Col>
                    </Row>
                </div>
            </Modal>
        </>
    );
};

export default Keypad;
