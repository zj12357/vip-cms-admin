import React, { ComponentProps, useMemo, useRef } from 'react';
import { ModalForm, ProFormSelect } from '@ant-design/pro-components';
import { ColumnsType } from 'antd/es/table';
import { GamingProps } from '@/types/api/eBet';
import { Col, Divider, message, Row, Table } from 'antd';
import { gamingResult, poker } from '@/common/commonConstType';
import { FormInstance } from 'antd/es';
import { useHttp } from '@/hooks';
import { calibrationGameRecord, manualSetGameRecord } from '@/api/eBet';
import { ResponseData } from '@/types/api/common';

interface GambleModalFormPageProps extends ComponentProps<any> {
    trigger: JSX.Element;
    modalType: 'settlement' | 'calibration'; // settlement-手动结算， calibration-校准结果
    entity: GamingProps;
    onFinish?: () => void;
    clubList: any[];
}

const GambleModalForm: React.FC<GambleModalFormPageProps> = ({
    trigger,
    modalType,
    entity,
    onFinish,
    clubList,
}) => {
    const formRef = useRef<FormInstance>();
    const { fetchData: settlementSubmit } = useHttp(manualSetGameRecord);
    const { fetchData: calibrationSubmit } = useHttp(calibrationGameRecord);
    const columns: ColumnsType<any> = useMemo(
        () => [
            {
                key: 'index',
                title: '',
                dataIndex: 'index',
                align: 'center',
            },
            {
                key: 'bank_point',
                title: '庄',
                dataIndex: 'bank_point',
                align: 'center',
            },
            {
                key: 'player_point',
                title: '闲',
                dataIndex: 'player_point',
                align: 'center',
            },
            {
                key: 'bank_pair',
                title: '庄对',
                dataIndex: 'bank_pair',
                align: 'center',
            },
            {
                key: 'player_pair',
                title: '闲对',
                dataIndex: 'player_pair',
                align: 'center',
            },
            {
                key: 'result',
                title: '结果',
                dataIndex: 'result',
                align: 'center',
                render: (value) => (
                    <span>
                        {gamingResult.find((g) => g.value === value)?.label ??
                            value}
                    </span>
                ),
            },
        ],
        [],
    );

    const dataSource = useMemo(
        () => ({
            index: '当前结果',
            bank_point: entity.bank_point,
            player_point: entity.player_point,
            result: entity.result,
            resultText:
                gamingResult.find((g) => g.value === entity.result)?.label ??
                entity.result,
            pair: entity.pair, // 对子 1庄对 2闲对 3都是对子 4无对
            bank_pair: [1, 3].includes(entity.pair ?? 4) ? 'Y' : 'N',
            player_pair: [2, 3].includes(entity.pair ?? 4) ? 'Y' : 'N',
        }),
        [entity],
    );

    const getPokerName = (code?: string) => {
        return poker?.find((p) => p.value === code)?.label ?? code;
    };

    const handleFinish = async (values: GamingProps) => {
        let res: ResponseData;
        if (modalType === 'settlement') {
            res = await settlementSubmit({ id: entity.id });
        } else {
            res = await calibrationSubmit({ ...values, id: entity.id });
        }
        if (res?.code === 10000) {
            message.success('操作成功');
            onFinish?.();
            return true;
        }
        return false;
    };

    return (
        <div>
            <ModalForm
                formRef={formRef}
                key={JSON.stringify(entity)}
                title={modalType === 'settlement' ? '手动结算' : '校对结果'}
                trigger={trigger}
                submitter={{
                    searchConfig: {
                        submitText:
                            modalType === 'settlement' ? '确定结算' : '确定',
                    },
                }}
                width={1200}
                onFinish={handleFinish}
                onVisibleChange={() => formRef?.current?.resetFields()}
            >
                <Row
                    style={{
                        marginBottom: 15,
                        fontSize: 15,
                        lineHeight: '30px',
                    }}
                >
                    <Col span={8}>
                        <Row>
                            <span>贵宾厅：</span>
                            <span>
                                {
                                    clubList.find(
                                        (cl) => cl.value === entity.club_id,
                                    )?.label
                                }
                            </span>
                        </Row>
                    </Col>
                    <Col span={16}>
                        <span>桌台：</span>
                        <span>{entity.desk_no}</span>
                    </Col>
                    <Col span={24}>
                        <Row>
                            <span>局号：</span>
                            <span>{entity.game_no}</span>
                        </Row>
                    </Col>
                </Row>
                <Table
                    columns={columns}
                    style={{ width: '100%' }}
                    dataSource={[dataSource]}
                    pagination={false}
                    size={'small'}
                    bordered
                />
                {modalType === 'calibration' && (
                    <Row style={{ marginTop: 20 }}>
                        <Col span={11}>
                            <Row
                                justify={'center'}
                                align={'middle'}
                                style={{
                                    flexDirection: 'column',
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 24,
                                        fontWeight: 'bold',
                                        color: 'blue',
                                    }}
                                >
                                    闲
                                </span>
                                <Row
                                    justify={'space-around'}
                                    style={{
                                        width: '100%',
                                        minHeight: 250,
                                        marginTop: 10,
                                    }}
                                    gutter={8}
                                >
                                    <Col span={8}>
                                        <Row
                                            justify={'space-between'}
                                            align={'middle'}
                                            style={{
                                                flexDirection: 'column',
                                                height: '100%',
                                            }}
                                        >
                                            <ProFormSelect
                                                name={'player3'}
                                                options={poker}
                                                initialValue={entity.player3}
                                            />
                                            <Row
                                                justify={'center'}
                                                align={'middle'}
                                                style={{
                                                    border: '1px solid #bfbfbf',
                                                    borderRadius: 5,
                                                    height: 90,
                                                    width: 180,
                                                }}
                                            >
                                                {getPokerName(entity.player3)}
                                            </Row>
                                        </Row>
                                    </Col>
                                    <Col span={8}>
                                        <Row
                                            justify={'space-between'}
                                            align={'middle'}
                                            style={{
                                                flexDirection: 'column',
                                                height: '100%',
                                            }}
                                        >
                                            <ProFormSelect
                                                name={'player1'}
                                                options={poker}
                                                initialValue={entity.player1}
                                            />
                                            <Row
                                                justify={'center'}
                                                align={'middle'}
                                                style={{
                                                    border: '1px solid #bfbfbf',
                                                    borderRadius: 5,
                                                    height: 180,
                                                    width: 95,
                                                }}
                                            >
                                                {getPokerName(entity.player1)}
                                            </Row>
                                        </Row>
                                    </Col>
                                    <Col span={8}>
                                        <Row
                                            justify={'space-between'}
                                            align={'middle'}
                                            style={{
                                                flexDirection: 'column',
                                                height: '100%',
                                            }}
                                        >
                                            <ProFormSelect
                                                name={'player2'}
                                                options={poker}
                                                initialValue={entity.player2}
                                            />
                                            <Row
                                                justify={'center'}
                                                align={'middle'}
                                                style={{
                                                    border: '1px solid #bfbfbf',
                                                    borderRadius: 5,
                                                    height: 180,
                                                    width: 95,
                                                }}
                                            >
                                                {getPokerName(entity.player2)}
                                            </Row>
                                        </Row>
                                    </Col>
                                </Row>
                            </Row>
                        </Col>
                        <Col>
                            <Divider
                                type={'vertical'}
                                style={{ height: '100%' }}
                            />
                        </Col>
                        <Col span={11}>
                            <Row
                                justify={'center'}
                                align={'middle'}
                                style={{ flexDirection: 'column' }}
                            >
                                <span
                                    style={{
                                        fontSize: 24,
                                        fontWeight: 'bold',
                                        color: 'red',
                                    }}
                                >
                                    庄
                                </span>
                                <Row
                                    justify={'space-around'}
                                    style={{
                                        width: '100%',
                                        minHeight: 250,
                                        marginTop: 10,
                                    }}
                                    gutter={8}
                                >
                                    <Col span={8}>
                                        <Row
                                            justify={'space-between'}
                                            align={'middle'}
                                            style={{
                                                flexDirection: 'column',
                                                height: '100%',
                                            }}
                                        >
                                            <ProFormSelect
                                                name={'bank1'}
                                                options={poker}
                                                initialValue={entity.bank1}
                                            />
                                            <Row
                                                justify={'center'}
                                                align={'middle'}
                                                style={{
                                                    border: '1px solid #bfbfbf',
                                                    borderRadius: 5,
                                                    height: 180,
                                                    width: 95,
                                                }}
                                            >
                                                {getPokerName(entity.bank1)}
                                            </Row>
                                        </Row>
                                    </Col>
                                    <Col span={8}>
                                        <Row
                                            justify={'space-between'}
                                            align={'middle'}
                                            style={{
                                                flexDirection: 'column',
                                                height: '100%',
                                            }}
                                        >
                                            <ProFormSelect
                                                name={'bank2'}
                                                options={poker}
                                                initialValue={entity.bank2}
                                            />
                                            <Row
                                                justify={'center'}
                                                align={'middle'}
                                                style={{
                                                    border: '1px solid #bfbfbf',
                                                    borderRadius: 5,
                                                    height: 180,
                                                    width: 95,
                                                }}
                                            >
                                                {getPokerName(entity.bank2)}
                                            </Row>
                                        </Row>
                                    </Col>
                                    <Col span={8}>
                                        <Row
                                            justify={'space-between'}
                                            align={'middle'}
                                            style={{
                                                flexDirection: 'column',
                                                height: '100%',
                                            }}
                                        >
                                            <ProFormSelect
                                                name={'bank3'}
                                                options={poker}
                                                initialValue={entity.bank3}
                                            />
                                            <Row
                                                justify={'center'}
                                                align={'middle'}
                                                style={{
                                                    border: '1px solid #bfbfbf',
                                                    borderRadius: 5,
                                                    height: 90,
                                                    width: 180,
                                                }}
                                            >
                                                {getPokerName(entity.bank3)}
                                            </Row>
                                        </Row>
                                    </Col>
                                </Row>
                            </Row>
                        </Col>
                    </Row>
                )}
            </ModalForm>
        </div>
    );
};

export default GambleModalForm;
