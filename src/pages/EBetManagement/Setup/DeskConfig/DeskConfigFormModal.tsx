import React, { ComponentProps, useCallback, useRef } from 'react';
import {
    ModalForm,
    ProFormSelect,
    ProFormText,
    ProFormRadio,
} from '@ant-design/pro-components';
import { FormInstance } from 'antd/es';
import { message, SelectProps } from 'antd';
import { deskStatus, gameMods } from '@/common/commonConstType';
import { ClubDeskProps } from '@/types/api/eBet';
import { useHttp } from '@/hooks';
import { addClubDeskList, updateClubDeskList } from '@/api/eBet';

interface DeskConfigFormModalProps extends ComponentProps<any> {
    trigger?: JSX.Element;
    clubList?: SelectProps<any>['options'];
    entity?: ClubDeskProps;
    onFinish?: () => void;
}

const DeskConfigFormModal: React.FC<DeskConfigFormModalProps> = ({
    trigger,
    clubList,
    entity,
    onFinish,
}) => {
    const formRef = useRef<FormInstance>();
    const { fetchData: editClubDesk } = useHttp(
        entity?.id ? updateClubDeskList : addClubDeskList,
        () => message.success('操作成功'),
    );

    const handleFinish = useCallback(
        async (values: ClubDeskProps) => {
            const res = await editClubDesk({
                ...values,
                id: entity?.id,
            });
            if (res.code === 10000) {
                onFinish?.();
                return true;
            }
            return false;
        },
        [editClubDesk, entity?.id, onFinish],
    );
    return (
        <div>
            <ModalForm
                title={entity?.id ? '修改桌台' : '新增桌台'}
                formRef={formRef}
                layout={'horizontal'}
                trigger={trigger}
                labelCol={{ span: 3 }}
                style={{
                    padding: 15,
                }}
                onFinish={handleFinish}
                onVisibleChange={() => formRef.current?.resetFields()}
            >
                <ProFormSelect
                    label={'选择贵宾厅'}
                    name={'club_id'}
                    options={clubList}
                    initialValue={entity?.club_id}
                    rules={[
                        {
                            required: true,
                            message: '请选择贵宾厅',
                        },
                    ]}
                    disabled={!!entity?.id}
                />
                <ProFormText
                    label={'桌台编号'}
                    name={'desk_no'}
                    initialValue={entity?.desk_no}
                    rules={[
                        {
                            required: true,
                            message: '请输入桌台编号',
                        },
                    ]}
                    disabled={!!entity?.id}
                />
                <ProFormText
                    label={'牌靴号'}
                    name={'shoe_no'}
                    initialValue={entity?.shoe_no}
                    disabled={!!entity?.id}
                />
                <ProFormText
                    label={'视频源地址'}
                    name={'video_url'}
                    initialValue={entity?.video_url}
                    rules={[
                        {
                            required: true,
                            message: '请输入视频源地址',
                        },
                    ]}
                    disabled={!!entity?.id}
                />
                <ProFormRadio.Group
                    label={'桌台模式'}
                    name={'game_mod'}
                    options={gameMods.filter((g) => g.value !== 3)}
                    initialValue={entity?.game_mod}
                    rules={[
                        {
                            required: true,
                            message: '请选择桌台模式',
                        },
                    ]}
                />
                <ProFormRadio.Group
                    label={'状态'}
                    name={'status'}
                    options={deskStatus.filter((d) => String(d.value) !== '1')}
                    initialValue={entity?.status}
                    rules={[
                        {
                            required: true,
                            message: '请选择状态',
                        },
                    ]}
                />
            </ModalForm>
        </div>
    );
};

export default DeskConfigFormModal;
