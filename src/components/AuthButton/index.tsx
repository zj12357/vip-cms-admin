import React, { FC, Fragment, useMemo } from 'react';
import { Button, ButtonProps } from 'antd';
import { useAppSelector } from '@/store/hooks';
import { selectMenuList } from '@/store/user/userSlice';
import { findMenuButton } from '@/common/commonHandle';
import { useLocation } from 'react-router-dom';
import Opcode from '../Opcode';
import { buttonNormalList } from '@/config/buttonList';
import _ from 'lodash';

export type OpcodeRequestParam = {
    menu_id: number;
    code: number;
};

type AuthButtonProps = {
    normal: string; //按钮标识
    trigger?: React.ReactNode; //opcode弹框dom，处理trigger元素不是Button类型
    childrenType?: 'modal' | 'text'; //子元素的类型
    firstVisible?: boolean; //外层的父级弹窗

    verify?: (isVerify: boolean, auth: string) => void; //返回校验结果
    onClose?: () => void; //关闭回调
    buttonProps?: ButtonProps; //按钮参数
    isSecond?: boolean; //二次验证
    secondDom?: React.ReactNode; //二次验证dom
    secondVisible?: boolean; //弹框显示
    secondVerify?: (isVerify: boolean) => void; //返回校验结果
    secondOnClose?: () => void; //关闭回调
};

export interface ButtonItem {
    menu_id: number;
    menu_name: string;
    normal: string;
    opcode: number;
}
const AuthButton: FC<AuthButtonProps> = ({
    normal,
    trigger,
    childrenType,
    children,
    verify,
    onClose,
    buttonProps,
    firstVisible,
    isSecond,
    secondDom,
    secondVerify,
    secondVisible,
    secondOnClose,
}) => {
    const location = useLocation();
    const menuList = useAppSelector(selectMenuList);

    //获取对应的菜单权限
    const authButton: ButtonItem[] = useMemo(() => {
        return findMenuButton(menuList, location.pathname, 'path', 'children');
    }, [menuList, location.pathname]);

    //按钮名称
    const buttonName = (normal: string) => {
        return buttonNormalList
            .find((item) => {
                //路由最后一截和定义的不相等

                const locationList = location.pathname
                    .split('/')
                    .slice()
                    .filter((v) => v !== '');

                const pathList = item.path
                    .split('/')
                    .slice()
                    .filter((v) => v !== '');

                if (
                    locationList[locationList.length - 1] !==
                    pathList[pathList.length - 1]
                ) {
                    return (
                        location.pathname.split('/').slice(0, -1).join('/') ===
                        item.path
                    );
                } else {
                    return location.pathname === item.path;
                }
            })
            ?.buttonList?.find((v) => v?.normal === normal)?.name;
    };

    return (
        <div>
            {authButton.map((item, index) => {
                if (item.normal === normal) {
                    const btnName = buttonName(item.normal);
                    return (
                        <Opcode
                            childrenType={childrenType}
                            children={children}
                            key={index}
                            btnInfo={item}
                            verify={verify}
                            onClose={onClose}
                            buttonName={btnName}
                            buttonProps={buttonProps}
                            trigger={trigger}
                            firstVisible={firstVisible}
                            isSecond={isSecond}
                            secondDom={secondDom}
                            secondVerify={secondVerify}
                            secondVisible={secondVisible}
                            secondOnClose={secondOnClose}
                        ></Opcode>
                    );
                }
                return null;
            })}
        </div>
    );
};

export default AuthButton;
