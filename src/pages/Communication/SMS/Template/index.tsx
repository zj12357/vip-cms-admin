import React, { useMemo, useRef, useState } from 'react';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { SmsTemplateProps } from '@/types/api/communication';
import { useHttp } from '@/hooks';
import { getSmsTemplateList } from '@/api/communication';
import SmsTemplateModalForm from '@/pages/Communication/SMS/Template/SmsTemplateModalForm';
import { Button } from 'antd';
import {
    languages,
    statusOptions,
    TemplateNames,
    templateTypes,
} from '@/pages/Communication/SMS/common';

interface TemplatePageProps {}

const TemplatePage: React.FC<TemplatePageProps> = () => {
    const tableRef = useRef<ActionType>();
    const { fetchData: fetchList } = useHttp(getSmsTemplateList);
    const [language, setLanguage] = useState<string>(languages[0]?.value);
    const columns: ProColumns<SmsTemplateProps, any>[] = useMemo(
        () => [
            {
                title: '模版ID',
                dataIndex: 'template_id',
                align: 'center',
                width: 100,
                hideInSearch: true,
            },
            {
                title: '模版类型',
                dataIndex: 'template_type',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: templateTypes,
                },
                width: 100,
            },
            {
                title: '模版名称',
                dataIndex: 'template_name',
                valueType: 'select',
                fieldProps: {
                    options: TemplateNames,
                },
                align: 'center',
                order: 9,
                width: 120,
            },
            {
                title: '是否启用',
                dataIndex: 'template_status',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: statusOptions,
                },
                order: 8,
                width: 120,
            },
            {
                title: '模版内容',
                dataIndex: 'template_content',
                align: 'center',
                ellipsis: true,
                hideInSearch: true,
            },
            {
                title: '操作时间',
                dataIndex: 'updated_at',
                align: 'center',
                valueType: 'milliDateTime',
                width: 160,
                hideInSearch: true,
            },
            {
                title: '操作人',
                dataIndex: 'operator',
                align: 'center',
                width: 120,
                hideInSearch: true,
            },
            {
                title: '操作',
                dataIndex: 'action',
                align: 'center',
                hideInSearch: true,
                width: 100,
                render: (_, entity) => (
                    <SmsTemplateModalForm
                        type="edit"
                        trigger={<Button type={'link'}>编辑</Button>}
                        entity={entity}
                        onOk={() => tableRef.current?.reload()}
                    />
                ),
            },
        ],
        [],
    );
    return (
        <div>
            <ProTable<SmsTemplateProps>
                rowKey={(record) => String(record.template_id)}
                actionRef={tableRef}
                columns={columns}
                toolbar={{
                    menu: {
                        type: 'tab',
                        activeKey: language,
                        items: languages.map((a) => ({
                            key: a.value,
                            label: a.label,
                        })),
                        onChange: (key) => {
                            setLanguage(String(key));
                        },
                    },
                    settings: [],
                }}
                dateFormatter={'number'}
                params={{
                    language: language,
                }}
                search={{
                    labelWidth: 'auto',
                    span: 6,
                    defaultCollapsed: false,
                    optionRender: (searchConfig, formProps, dom) => [
                        <SmsTemplateModalForm
                            type="add"
                            trigger={<Button type="primary">新增</Button>}
                            onOk={() => tableRef.current?.reload()}
                        />,
                        dom,
                    ],
                }}
                request={async ({ current, pageSize, ...params }) => {
                    const res = await fetchList({
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
        </div>
    );
};

export default TemplatePage;
