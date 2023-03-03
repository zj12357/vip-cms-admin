import React, { useMemo, useState } from 'react';
import { Col, Menu, Row, Tabs } from 'antd';
import { PhoneFilled } from '@ant-design/icons';
import {
    CallStatus,
    callStatus,
    callType,
    formatHMS,
    lineTypes,
    phoneType,
    ServiceType,
    serviceType,
} from '@/pages/Communication/Telephone/CallModal/common';
import './index.scoped.scss';
import classNames from 'classnames';
import { LogProps } from '@/store/communication/types';
import { call } from '@/api/communication';

interface Props<T = LogProps> extends React.ComponentProps<any> {
    data: T[];
    onChange?: (item: T) => void;
}

const CallMenus: React.FC<Props> = ({ data, onChange, selectedKeys }) => {
    const [activeKey, setActiveKey] = useState(lineTypes[0]?.value);
    const callLogs = useMemo(
        () =>
            data.map((d) => {
                let serviceType;
                if (
                    [
                        CallStatus.RINGING,
                        CallStatus.CALL,
                        CallStatus.HOLD,
                    ].includes(d.status)
                ) {
                    serviceType = ServiceType.IN_SERVICE;
                } else if (
                    [
                        CallStatus.HANGUP_USER,
                        CallStatus.HANGUP_SERVICE,
                        CallStatus.END,
                    ].includes(d.status)
                ) {
                    serviceType = ServiceType.COMPLETE;
                } else {
                    serviceType = ServiceType.MISSED;
                }
                return {
                    ...d,
                    serviceType,
                };
            }),
        [data],
    );
    return (
        <div className="log-menus">
            <Tabs
                tabBarStyle={{ width: '100%' }}
                activeKey={activeKey}
                onChange={setActiveKey}
                centered
            >
                {lineTypes.map((t) => {
                    return (
                        <Tabs.TabPane tab={t.label} key={t.value}>
                            <Menu
                                mode={'inline'}
                                inlineIndent={18}
                                onSelect={({ key }) => {
                                    const data = callLogs.find(
                                        (cl) => cl.id === key,
                                    );
                                    if (data) {
                                        onChange?.(data);
                                    }
                                }}
                                defaultOpenKeys={serviceType.map(
                                    (s) => s.value,
                                )}
                                selectedKeys={selectedKeys}
                                items={serviceType.map((s) => {
                                    const items = callLogs.filter(
                                        (cl) => cl.serviceType === s.value,
                                    );
                                    return {
                                        key: s.value,
                                        title: s.label,
                                        label: `${s.label}(${items.length})`,
                                        className: s.value,
                                        children: items.map((cl) => ({
                                            key: cl.id,
                                            icon: (
                                                <PhoneFilled
                                                    className={classNames(
                                                        'icon',
                                                        cl.status ===
                                                            CallStatus.RINGING
                                                            ? 'ringing'
                                                            : '',
                                                    )}
                                                />
                                            ),
                                            label: (
                                                <Row className="item-label">
                                                    <Col span={19}>
                                                        {cl.phone}
                                                    </Col>
                                                    <Col
                                                        span={5}
                                                        className="right"
                                                    >
                                                        {
                                                            phoneType.find(
                                                                (p) =>
                                                                    p.value ===
                                                                    cl.phoneType,
                                                            )?.label
                                                        }
                                                    </Col>
                                                    <Col
                                                        span={19}
                                                        className="status"
                                                    >
                                                        <span className="text">
                                                            {
                                                                callStatus.find(
                                                                    (p) =>
                                                                        p.value ===
                                                                        cl.status,
                                                                )?.label
                                                            }
                                                        </span>
                                                        {(cl.endTime &&
                                                            cl.startTime && (
                                                                <span>
                                                                    {formatHMS(
                                                                        cl.startTime,
                                                                        cl.endTime,
                                                                    )}
                                                                </span>
                                                            )) ||
                                                            ''}
                                                    </Col>
                                                    <Col
                                                        span={5}
                                                        className="right"
                                                    >
                                                        {
                                                            callType.find(
                                                                (p) =>
                                                                    p.value ===
                                                                    cl.callType,
                                                            )?.label
                                                        }
                                                    </Col>
                                                </Row>
                                            ),
                                        })),
                                    };
                                })}
                            />
                        </Tabs.TabPane>
                    );
                })}
            </Tabs>
        </div>
    );
};

export default CallMenus;
