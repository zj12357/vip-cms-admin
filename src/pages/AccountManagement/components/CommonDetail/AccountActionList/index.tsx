import React, { FC, ReactNode, useState, useEffect } from 'react';
import { Collapse, Button } from 'antd';
import RemarkList from './ActionList/RemarkList';
import AuthorizeList from './ActionList/AuthorizeList';
import CustomerList from './ActionList/CustomerList';
import DepositCardList from './ActionList/DepositCardList';
import CreditMarkerList from './ActionList/CreditMarkerList';
import SignedMList from './ActionList/SignedMList';
import StartList from './ActionList/StartList';
import PointsList from './ActionList/PointsList';
import TransCodeList from './ActionList/TransformCodeList';
import UpAndDownList from './ActionList/UpAndDownList';
import { useAppSelector } from '@/store/hooks';
import { selectAccountType } from '@/store/account/accountSlice';
import AuthButton from '@/components/AuthButton';
import './index.scoped.scss';

const { Panel } = Collapse;

type AccountActionListProps = {};
interface CollapseListItem {
    key: number;
    name: string;
    component: ReactNode;
    nooptcode?: boolean;
    normal?: string;
}

const AccountActionList: FC<AccountActionListProps> = (props) => {
    const accountType = useAppSelector(selectAccountType);
    const [width, setWidth] = useState<number>(0);
    const collapseList: CollapseListItem[] = [
        {
            key: 1,
            name: '户口备注',
            component: <RemarkList></RemarkList>,
            nooptcode: true,
        },

        {
            key: 3,
            name: '客户',
            component: <CustomerList></CustomerList>,
            normal: 'customerAccount-customer-open',
        },
        {
            key: 4,
            name: '存卡概况',
            component: <DepositCardList></DepositCardList>,
            normal: 'customerAccount-card-open',
        },

        {
            key: 5,
            name: '信贷额/Marker',
            component: <CreditMarkerList></CreditMarkerList>,
            normal: 'customerAccount-credit-open',
        },
        {
            key: 6,
            name: '已签M',
            component: <SignedMList></SignedMList>,
            normal: 'customerAccount-signed-open',
        },
        {
            key: 7,
            name: '开工记录',
            component: <StartList></StartList>,
            normal: 'customerAccount-start-open',
        },
        {
            key: 8,
            name: '积分消费',
            component: <PointsList></PointsList>,
            normal: 'customerAccount-point-open',
        },
        {
            key: 9,
            name: '转码详情',
            component: <TransCodeList></TransCodeList>,
            normal: 'customerAccount-trans-open',
        },
        {
            key: 10,
            name: '上下线管理',
            component: <UpAndDownList></UpAndDownList>,
            normal: 'customerAccount-up-open',
        },
    ];

    const [activeKey, setActiveKey] = useState(['1']);
    const [akPromise, setAkPromise] = useState(null as any);

    useEffect(() => {
        const panel =
            document.getElementsByClassName('account-panel-item')?.[0];

        if (panel) {
            setWidth(panel?.clientWidth ?? 0);
        }
    }, []);
    return (
        <div
            style={{
                marginTop: '50px',
            }}
        >
            <Collapse
                destroyInactivePanel
                activeKey={activeKey}
                onChange={(ak) =>
                    activeKey.length > ak.length ||
                    (ak as string[]).find(
                        (x) => x === '1' && !activeKey.includes(x),
                    )
                        ? setActiveKey(ak as string[])
                        : setAkPromise(Promise.resolve(ak))
                }
            >
                {collapseList
                    .filter((v) => ![2].includes(v.key))
                    .map((item) => (
                        <Panel
                            header={
                                item.nooptcode ||
                                activeKey.includes(item.key.toString()) ? (
                                    item.name
                                ) : (
                                    <AuthButton
                                        normal={item.normal || ''}
                                        verify={(pass) => {
                                            pass &&
                                                akPromise?.then(setActiveKey);
                                        }}
                                        buttonProps={{
                                            size: 'small',
                                            style: {
                                                width: `calc(${width}px - 40px)`,
                                                border: 'none',
                                                background: 'none',
                                                textAlign: 'left',
                                                boxShadow: 'none',
                                            },
                                        }}
                                    >
                                        {item.name}
                                    </AuthButton>
                                )
                            }
                            key={item.key}
                            className="account-panel-item"
                        >
                            {item.component}
                        </Panel>
                    ))}
            </Collapse>
        </div>
    );
};

export const AccountActionListLeft: FC<AccountActionListProps> = (props) => {
    const collapseListLeft: CollapseListItem[] = [
        {
            key: 2,
            name: '授权人',
            component: <AuthorizeList></AuthorizeList>,
        },
    ];
    return (
        <div
            style={{
                marginTop: '50px',
            }}
        >
            <Collapse destroyInactivePanel defaultActiveKey={['2']}>
                {collapseListLeft.map((item) => (
                    <Panel
                        header={item.name}
                        key={item.key}
                        className="account-panel-item"
                    >
                        {item.component}
                    </Panel>
                ))}
            </Collapse>
        </div>
    );
};

export default AccountActionList;
