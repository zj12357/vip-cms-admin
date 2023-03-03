import React, {
    ComponentProps,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    ModalForm,
    ProFormCheckbox,
    ProFormText,
    ProFormTextArea,
    ProFormDateTimeRangePicker,
} from '@ant-design/pro-components';
import { useHttp } from '@/hooks';
import { AnnouncementProps } from '@/types/api/eBet';
import { announcementInsert, announcementUpdate } from '@/api/eBet';
import { announceTypes } from '@/common/commonConstType';

interface AnnounceFormModalProps extends ComponentProps<any> {
    trigger: JSX.Element;
    onFinish?: () => void;
    entity?: AnnouncementProps;
    type?: 'view' | 'edit';
}

interface AnnounceFormProps {
    lang: string[];
    title_cn: string;
    title_kr: string;
    title_en: string;
    content_cn: string;
    content_kr: string;
    content_en: string;
    start_at?: number;
    ended_at?: number;
    type_array?: string[];
    [key: string]: any;
}

export const langOptions = [
    {
        value: 'cn',
        label: '中文',
    },
    {
        value: 'en',
        label: '英语',
    },
    {
        value: 'kr',
        label: '韩语',
    },
];

const AnnounceFormModal: React.FC<AnnounceFormModalProps> = ({
    trigger,
    onFinish,
    entity,
    type,
}) => {
    const [refresh, setRefresh] = useState<boolean>(false);
    const formRef = useRef<any>();

    const { fetchData: submitForm } = useHttp(
        entity?.id ? announcementUpdate : announcementInsert,
    );

    const initValues: AnnounceFormProps = useMemo(
        () => ({
            lang: Object.keys(entity?.title ?? {}).filter(
                (key: string) => !!entity?.title?.[key],
            ),
            title_cn: entity?.title?.cn || '',
            title_en: entity?.title?.en || '',
            title_kr: entity?.title?.kr || '',
            content_cn: entity?.title?.cn || '',
            content_en: entity?.title?.en || '',
            content_kr: entity?.title?.kr || '',
            start_at: entity?.start_at,
            ended_at: entity?.ended_at,
            type_array: entity?.type_array,
        }),
        [entity],
    );

    useEffect(() => {
        refresh && setRefresh(false);
    }, [refresh]);

    const selectedLangs =
        formRef?.current
            ?.getFieldValue('lang')
            ?.map((val: string) => langOptions.find((a) => a.value === val)) ??
        [];

    const handleFinish = useCallback(
        async (values: AnnounceFormProps) => {
            const data: AnnouncementProps = {
                title: {
                    cn: values.title_cn,
                    kr: values.title_kr,
                    en: values.title_en,
                },
                content: {
                    cn: values.content_cn,
                    kr: values.content_kr,
                    en: values.content_en,
                },
                type_array: values.type_array,
                start_at: values.start_at,
                ended_at: values.ended_at,
                id: entity?.id,
            };
            const res = await submitForm(data);
            if (res.code === 10000) {
                formRef?.current?.resetFields();
                onFinish?.();
                return true;
            }
            return false;
        },
        [entity?.id, onFinish, submitForm],
    );

    return (
        <ModalForm<AnnounceFormProps>
            trigger={trigger}
            formRef={formRef}
            onValuesChange={(values) => {
                setRefresh(true);
            }}
            submitter={type === 'view' ? false : undefined}
            onFinish={handleFinish}
            onVisibleChange={() => {
                formRef?.current?.resetFields();
                setRefresh(true);
            }}
        >
            <div>
                <ProFormCheckbox.Group
                    name="lang"
                    options={langOptions}
                    label="选择公告语言"
                    initialValue={initValues.lang}
                />
                {selectedLangs.map((value: any) => {
                    return (
                        <div
                            key={value.value}
                            style={{
                                border: '1px solid #f0f0f0',
                                borderRadius: 10,
                                padding: 10,
                                marginBottom: 10,
                            }}
                        >
                            <ProFormText
                                width="md"
                                name={`title_${value.value}`}
                                initialValue={
                                    initValues[`title_${value.value}`]
                                }
                                label={`标题（${value.label}）`}
                                placeholder="请输入标题"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入标题',
                                    },
                                ]}
                            />
                            <ProFormTextArea
                                width="md"
                                name={`content_${value.value}`}
                                initialValue={
                                    initValues[`content_${value.value}`]
                                }
                                label={`内容（${value.label}）`}
                                placeholder="请输入内容"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入内容',
                                    },
                                ]}
                            />
                        </div>
                    );
                })}
                <ProFormCheckbox.Group
                    name="type_array"
                    initialValue={initValues.type_array}
                    options={announceTypes}
                    label="选择公告类型"
                />
                <ProFormDateTimeRangePicker
                    transform={(values) => {
                        return {
                            start_at: values
                                ? new Date(values[0]).getTime()
                                : undefined,
                            ended_at: values
                                ? new Date(values[1]).getTime()
                                : undefined,
                        };
                    }}
                    width="xl"
                    name="validTime"
                    initialValue={[initValues.start_at, initValues.ended_at]}
                    label="公告生效时间"
                />
            </div>
        </ModalForm>
    );
};

export default AnnounceFormModal;
