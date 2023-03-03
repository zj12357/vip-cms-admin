import React, { FC, Suspense, useState, useEffect, useMemo } from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';
import { RouteItem } from '@/components/HOC/withAuth';
import _ from 'lodash';

interface CommonProps {
    authSecondRoute: RouteItem[];
    authThirdRoute: RouteItem[];
    fourthRoute?: boolean;
}
interface MenuListItem {
    label: string;
    key: string;
    children?: MenuListItem[];
}
type PageRouteProps = {} & Partial<CommonProps>;

//页面权限控制
const PageRoute: FC<PageRouteProps> = ({ authThirdRoute, fourthRoute }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [currentMenu, setCurrentMenu] = useState<MenuListItem[]>([]);

    const newAuthPageRoute = useMemo(() => {
        return (
            authThirdRoute?.map((item) => ({
                label: item.name,
                key: item.path,
                children: fourthRoute
                    ? item.children?.map((i) => {
                          return {
                              label: i.name || i.menu_name || '',
                              key: i.path,
                          };
                      })
                    : undefined,
            })) ?? []
        );
    }, [authThirdRoute, fourthRoute]);
    const handleClick: MenuProps['onClick'] = (e) => {
        if (location.pathname === e.key) {
            return;
        }
        navigate({ pathname: e.key });
    };

    useEffect(() => {
        if (newAuthPageRoute?.length === 0) {
            navigate('/');
        }
        _.delay(() => {
            setCurrentMenu(newAuthPageRoute);
        }, 200);
    }, [location.pathname, authThirdRoute, navigate, newAuthPageRoute]);
    return (
        <div>
            {currentMenu?.length > 0 ? (
                <>
                    <Menu
                        onClick={handleClick}
                        mode="horizontal"
                        items={currentMenu}
                        defaultSelectedKeys={[location.pathname]}
                        style={{
                            marginBottom: '20px',
                        }}
                    />
                    <Suspense fallback={<Loading />}>
                        <Outlet></Outlet>
                    </Suspense>
                </>
            ) : (
                <Empty></Empty>
            )}
        </div>
    );
};

export default PageRoute;
