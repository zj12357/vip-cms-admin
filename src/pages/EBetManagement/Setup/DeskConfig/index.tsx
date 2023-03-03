import React, { useEffect, useMemo, useRef } from 'react';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { ClubDeskProps } from '@/types/api/eBet';
import { useHttp } from '@/hooks';
import { deleteClubDeskList, queryClubDeskList, vipClubList } from '@/api/eBet';
import { Button, message, Modal, Row } from 'antd';
import DeskConfigFormModal from '@/pages/EBetManagement/Setup/DeskConfig/DeskConfigFormModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectVipClubList, setVipClubList } from '@/store/eBet/eBetSlice';
import { deskStatus, gameMods } from '@/common/commonConstType';

type DeskConfigPageProps = {};

const DeskConfigPage: React.FC<DeskConfigPageProps> = (props) => {
    const tableRef = useRef<ActionType>();
    const dispatch = useAppDispatch();
    // 获取贵宾厅
    const { fetchData: getVipClubList } = useHttp(vipClubList, (res) => {
        dispatch(setVipClubList(res.data));
    });
    useEffect(() => {
        getVipClubList().then();
    }, [getVipClubList]);
    const vipClubOptions = useAppSelector(selectVipClubList);
    const vipClubSelectOptions = vipClubOptions.map((v) => ({
        value: v.id,
        label: v.name,
    }));

    const { fetchData: fetchList } = useHttp(queryClubDeskList);
    const { fetchData: deleteData } = useHttp(deleteClubDeskList, () => {
        message.success('删除成功');
        tableRef?.current?.reload();
    });

    const columns = useMemo<ProColumns<ClubDeskProps>[]>(
        () => [
            {
                title: '桌台号',
                dataIndex: 'desk_no',
                align: 'center',
            },
            {
                title: '贵宾厅',
                dataIndex: 'club_id',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: vipClubSelectOptions,
                },
            },
            // {
            //     title: '牌靴号',
            //     dataIndex: 'shoe_no',
            //     align: 'center',
            // },
            {
                title: '桌台模式',
                dataIndex: 'game_mod',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: gameMods,
                },
                hideInSearch: true,
            },
            {
                title: '状态',
                dataIndex: 'status',
                align: 'center',
                valueType: 'select',
                fieldProps: {
                    options: deskStatus,
                },
                render: (dom, entity) => {
                    return (
                        <div
                            style={{
                                color: entity.status === 1 ? 'red' : 'green',
                            }}
                        >
                            {dom}
                        </div>
                    );
                },
            },
            {
                title: '视频源',
                dataIndex: 'video_url',
                align: 'center',
                hideInSearch: true,
            },
            {
                title: '操作',
                dataIndex: 'action',
                align: 'center',
                hideInSearch: true,
                render: (dom, entity) => (
                    <Row justify={'center'} align={'middle'}>
                        <DeskConfigFormModal
                            trigger={<Button type={'primary'}>修改</Button>}
                            onFinish={() => {
                                tableRef?.current?.reload();
                            }}
                            clubList={vipClubSelectOptions}
                            entity={entity}
                        />
                        {/*<Button*/}
                        {/*    type="primary"*/}
                        {/*    style={{ margin: 5 }}*/}
                        {/*    onClick={() => {*/}
                        {/*        Modal.confirm({*/}
                        {/*            title: '请确定是否要删除当前桌台？',*/}
                        {/*            onOk: async () => {*/}
                        {/*                await deleteData({ id: entity.id });*/}
                        {/*            },*/}
                        {/*        });*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    删除*/}
                        {/*</Button>*/}
                    </Row>
                ),
            },
        ],
        [vipClubSelectOptions],
    );
    return (
        <div>
            <ProTable<ClubDeskProps>
                actionRef={tableRef}
                columns={columns}
                toolBarRender={false}
                rowKey={(record) => String(record.id)}
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
                scroll={{
                    x: 1200,
                }}
                search={{
                    defaultCollapsed: false,
                    optionRender: (searchConfig, formProps, dom) => [
                        <DeskConfigFormModal
                            key="add"
                            trigger={<Button type={'primary'}>新增</Button>}
                            clubList={vipClubSelectOptions}
                            onFinish={() => {
                                tableRef?.current?.reload();
                            }}
                        />,
                        dom,
                    ],
                }}
            />
        </div>
    );
};

export default DeskConfigPage;
