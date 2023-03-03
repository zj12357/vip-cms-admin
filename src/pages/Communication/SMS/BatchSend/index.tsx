import React, { useCallback, useMemo, useState } from 'react';
import { Button, Radio, Row, Tabs, Input, message } from 'antd';
import {
    MemberPhoneInfo,
    SmsSendBatchQuery,
    SmsTemplateProps,
} from '@/types/api/communication';
import { useHttp } from '@/hooks';
import { getSmsTemplateList, smsSendBatch } from '@/api/communication';
import { ProTable } from '@ant-design/pro-components';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import SelectAccountModal from '@/pages/Communication/SMS/BatchSend/SelectAccountModal';

interface BatchSendPageProps {}

const BatchSendPage: React.FC<BatchSendPageProps> = () => {
    const { fetchData: fetchTemplateList } = useHttp(getSmsTemplateList);
    const { fetchData: sendSmsBatch, loading: sending } = useHttp(smsSendBatch);

    const [templateName, setTemplateName] = useState<string | undefined>();
    const [phones, setPhones] = useState<any>();
    const [memberData, setMemberData] = useState<MemberPhoneInfo[]>();

    const [templateContent, setTemplateContent] = useState<
        string | undefined
    >();

    const columns: ProColumns<SmsTemplateProps>[] = useMemo(
        () => [
            {
                title: '模版内容',
                dataIndex: 'template_content',
                ellipsis: true,
            },
            {
                title: '操作',
                width: 100,
                align: 'center',
                render: (dom, entity) => <Radio value={entity.template_name} />,
            },
        ],
        [],
    );

    const handleSubmit = useCallback(async () => {
        if (
            !phones ||
            phones.type === undefined ||
            (phones.type === 0 && phones.all?.lenght === 0)
        ) {
            return message.error('请选择户口');
        }
        if (!templateName && !templateContent) {
            return message.error('请选择模版或者自定义模版内容');
        }
        const payload: SmsSendBatchQuery = {
            is_all: phones.type !== 0,
            mobile_language: phones.type !== 0 ? [] : phones.all,
            template_name: templateName,
            message_content: templateContent,
        };
        const res = await sendSmsBatch(payload);
        if (res.code === 10000) {
            message.success('操作成功');
            // 清空数据
            setMemberData(undefined);
            setTemplateName(undefined);
            setTemplateContent(undefined);
            setPhones(undefined);
        }
    }, [phones, sendSmsBatch, templateContent, templateName]);

    return (
        <div style={{ maxWidth: 900 }}>
            <SelectAccountModal
                trigger={<Button type={'primary'}>选择户口</Button>}
                loadData={setMemberData}
                data={memberData}
                onChange={setPhones}
            />
            <Row style={{ marginTop: 15 }}>
                <Tabs
                    type={'card'}
                    onChange={(val) => {
                        setTemplateName(undefined);
                        setTemplateContent(undefined);
                    }}
                    style={{ width: '100%' }}
                >
                    <Tabs.TabPane key={'1'} tab={'选择模版'}>
                        <Radio.Group
                            onChange={(e) => setTemplateName(e.target.value)}
                            value={templateName}
                        >
                            <ProTable<SmsTemplateProps>
                                rowKey={(record) => String(record.template_id)}
                                columns={columns}
                                search={false}
                                pagination={{ hideOnSinglePage: true }}
                                size={'small'}
                                toolBarRender={false}
                                scroll={{ y: 300 }}
                                params={{
                                    template_type: 'market',
                                    template_status: 1,
                                    language: 'zh',
                                }}
                                request={async ({
                                    current,
                                    pageSize,
                                    ...params
                                }) => {
                                    const res = await fetchTemplateList({
                                        ...params,
                                        page: current,
                                        size: pageSize,
                                    });
                                    return {
                                        data: res?.data?.list,
                                        success: true,
                                        total: res?.data?.total,
                                    };
                                }}
                            />
                        </Radio.Group>
                    </Tabs.TabPane>
                    <Tabs.TabPane key={'2'} tab={'自定义'}>
                        <Input.TextArea
                            rows={6}
                            placeholder={'请输入自定义模版内容'}
                            value={templateContent}
                            onChange={(e) => setTemplateContent(e.target.value)}
                        />
                    </Tabs.TabPane>
                </Tabs>
            </Row>
            <Button
                type={'primary'}
                onClick={handleSubmit}
                style={{ marginTop: 20 }}
                loading={sending}
            >
                立即发送
            </Button>
        </div>
    );
};

export default BatchSendPage;
