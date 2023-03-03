import React, { FC, useState } from 'react';
import { Row, Col } from 'antd';
import { useHttp } from '@/hooks';
import moment from 'moment';
import type { ProColumns } from '@ant-design/pro-components';
import {
    ModalForm,
    ProForm,
    ProFormTextArea,
    ProTable,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import AuthButton from '@/components/AuthButton';
import {
    chipsCreate,
    getChipsList,
    getPrintConvertChips,
} from '@/api/admission';
import {
    ChipsCreateParams,
    ChipsListParams,
    resChipsList,
} from '@/types/api/admission';
import ModalHead from '../AdmissionDetail/components/modalHead';
import Print, { formatChips } from '@/components/Print';
import Currency from '@/components/Currency';
import FormCurrency from '@/components/Currency/FormCurrency';
import { chipType } from '@/common/commonConstType';
import usePrint from '@/hooks/usePrint';
import { TicketDataProps } from '@/hooks/usePrint/print';

type TranscodingProps = {
    round: string;
    onSuccess: () => void;
};
interface DataItem {
    created_at: number;
    convert_chips_type_name: string;
    convert_chips: number;
    total_convert_chips: number;
    remark: string;
    remarker: string;
    convert_chips_record_id: number;
    log_id: string;
    convert_chips_type: number;
}

const Transcoding: FC<TranscodingProps> = ({ round, onSuccess }) => {
    const [isPass, setIsPass] = useState(false);
    const { RegisterPrint, handlePrint } = usePrint<TicketDataProps>('Ticket');

    // 转码提交
    const { fetchData: createChips } = useHttp<ChipsCreateParams, null>(
        chipsCreate,
    );
    // 转码列表查询
    const { fetchData: chipsList } = useHttp<ChipsListParams, resChipsList>(
        getChipsList,
    );
    // 转码打印数据
    const { fetchData: printCovertChips } = useHttp(getPrintConvertChips);

    const columns: ProColumns<DataItem>[] = [
        {
            dataIndex: 'created_at',
            key: 'created_at',
            title: '操作时间',
            align: 'center',
            render: (_, record) => {
                return moment(record.created_at * 1000).format(
                    'YYYY-MM-DD HH:mm:ss',
                );
            },
        },
        {
            dataIndex: 'convert_chips_type',
            key: 'convert_chips_type',
            title: '操作类型',
            align: 'center',
            render: (_, record) =>
                chipType.find(
                    (item) => item.value === record.convert_chips_type,
                )?.label,
        },
        {
            dataIndex: 'convert_chips',
            key: 'convert_chips',
            title: '转码数(万)',
            align: 'center',
            render: (_, record) => (
                <Currency value={record.convert_chips + ''} />
            ),
        },
        {
            dataIndex: 'total_convert_chips',
            key: 'total_convert_chips',
            title: '总转码',
            align: 'center',
            render: (_, record) => (
                <Currency value={record.total_convert_chips + ''} />
            ),
        },
        {
            dataIndex: 'remark',
            key: 'remark',
            title: '备注',
            align: 'center',
        },
        {
            dataIndex: 'created_by',
            key: 'created_by',
            title: '操作人',
            align: 'center',
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            align: 'center',
            render: (text, record, _, action) => (
                <Print
                    trigger={<Button type="link">打印</Button>}
                    visible={!!record.log_id}
                    templateType="Ticket"
                    getData={async () => {
                        const res = await printCovertChips({
                            log_id: record.log_id,
                            convert_chips_type: record.convert_chips_type,
                        });
                        if (res.code === 10000) {
                            const data = res.data;
                            return formatChips(data);
                        }
                    }}
                />
            ),
        },
    ];

    return (
        <>
            <ModalForm
                layout="horizontal"
                trigger={
                    <AuthButton
                        normal="admissionButton-trancoding"
                        verify={(pass) => {
                            setIsPass(pass);
                        }}
                        trigger={
                            <span className="m-primary-font-color pointer">
                                转码
                            </span>
                        }
                        buttonProps={{
                            type: 'primary',
                        }}
                    ></AuthButton>
                }
                modalProps={{
                    destroyOnClose: true,
                }}
                visible={isPass}
                onVisibleChange={(val) => {
                    setIsPass(val);
                }}
                onFinish={async (values: any) => {
                    const res = await createChips({
                        round,
                        chips_num: +values.chips_num,
                        ...values,
                    });
                    if (res.code === 10000) {
                        onSuccess();
                        message.success(res.msg);
                        let { small_ticket } = res.data || ({} as any);
                        small_ticket.operation_type = '转码';
                        handlePrint({
                            items: [
                                { k: 'member_code', n: '客户户口' },
                                { k: 'operation_type', n: '操作类型' },
                                {
                                    k: 'created_at',
                                    n: '转码时间',
                                    type: 'Date',
                                },
                                { k: 'round', n: '场次编号' },
                                // {
                                //     k: 'amount',
                                //     n: '泥码',
                                //     type: 'Currency',
                                // },
                                {
                                    k: 'convert_chips',
                                    n: '转码量',
                                    type: 'Currency',
                                },
                                {
                                    k: 'total_convert_chips',
                                    n: '总转码',
                                    type: 'Currency',
                                },
                            ].map((x) => {
                                return {
                                    type: x.type,
                                    label: x.n,
                                    value: small_ticket
                                        ? small_ticket[x.k]
                                        : '- -',
                                };
                            }),
                        });
                        return true;
                    }
                }}
                title="转码"
                width={1100}
                style={{
                    maxHeight: '50vh',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                }}
            >
                <Row>
                    <Col span={14}>
                        <div
                            style={{
                                height: '472px',
                                overflowY: 'auto',
                                paddingRight: '20px',
                            }}
                        >
                            <ProTable<DataItem>
                                columns={columns}
                                request={async (params, sorter, filter) => {
                                    const res: any = await chipsList({
                                        recode_type: 1,
                                        round,
                                        convert_chips_type: 0,
                                        page: params.current || 1,
                                        size: params.pageSize || 10,
                                    });
                                    return Promise.resolve({
                                        data: res.data.list,
                                        total: res.data.total,
                                        success: true,
                                    });
                                }}
                                scroll={{ y: 350 }}
                                rowKey="convert_chips_record_id"
                                pagination={{
                                    showQuickJumper: true,
                                }}
                                bordered
                                toolBarRender={false}
                                search={false}
                                size="small"
                            />
                        </div>
                    </Col>
                    <Col span={10}>
                        <div
                            style={{
                                paddingLeft: '20px',
                            }}
                        >
                            <ModalHead span={12} round={round} />
                            <Row justify="center">
                                <ProForm.Group>
                                    <FormCurrency
                                        name="chips_num"
                                        label="转码数"
                                        rules={[
                                            {
                                                required: true,
                                                message: '转码数不能为空',
                                            },
                                        ]}
                                    />
                                </ProForm.Group>
                                <p
                                    style={{
                                        color: '#ccc',
                                        fontSize: '12px',
                                        marginBottom: '24px',
                                    }}
                                >
                                    <ExclamationCircleFilled />
                                    正数为现金码转泥码，负数为泥码转现金码；
                                </p>
                            </Row>
                            <Row>
                                <ProForm.Group>
                                    <ProFormTextArea
                                        label="备注"
                                        name="remark"
                                        width="md"
                                    />
                                </ProForm.Group>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </ModalForm>
            <RegisterPrint />
        </>
    );
};

export default Transcoding;
