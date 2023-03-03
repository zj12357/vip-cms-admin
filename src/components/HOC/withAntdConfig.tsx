import React, { useContext } from 'react';
import { ConfigProvider } from 'antd';
import { ProProvider } from '@ant-design/pro-components';
import { ComponentType } from 'react';
import zhCN from 'antd/es/locale/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';
import { hideMiddleNumber } from '@/utils/tools';

moment.locale('zh-cn');

export default function WithAntdConfig<Props>(
    WrappedComponent: ComponentType<Props>,
) {
    const Component: ComponentType<Props> = (props) => {
        const values = useContext(ProProvider);
        return (
            <ConfigProvider locale={zhCN} autoInsertSpaceInButton>
                <ProProvider.Provider
                    value={{
                        ...values,
                        valueTypeMap: {
                            //自定义数字加密类型
                            encryption: {
                                render: (text) => (
                                    <span>{hideMiddleNumber(text) ?? '-'}</span>
                                ),
                            },
                            //自定义毫秒级时间戳-天
                            milliDate: {
                                render: (text: number) => (
                                    <span>
                                        {text
                                            ? moment
                                                  .unix(text)
                                                  .format('YYYY-MM-DD')
                                            : '-'}
                                    </span>
                                ),
                            },
                            //自定义毫秒级时间戳-小时
                            milliDateTime: {
                                render: (text: number) => (
                                    <span>
                                        {text
                                            ? moment
                                                  .unix(text)
                                                  .format('YYYY-MM-DD HH:mm:ss')
                                            : '-'}
                                    </span>
                                ),
                            },
                        },
                    }}
                >
                    <WrappedComponent {...props} />
                </ProProvider.Provider>
            </ConfigProvider>
        );
    };

    Component.displayName = `WithAntdConfig(${
        WrappedComponent.displayName || WrappedComponent.name
    })`;

    return Component;
}
