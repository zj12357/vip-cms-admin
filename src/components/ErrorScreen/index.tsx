import { Button, Result } from 'antd';
import { AxiosResponse } from 'axios';
import { Component, default as React } from 'react';
import request from '@/utils/request';
import { ErrorScreenState, ErrorScreenType } from '@/store/errorScreen/types';
import { ReloadOutlined, CloseOutlined } from '@ant-design/icons';
import './index.scoped.scss';

export interface ErrorScreenStateProps {
    error: ErrorScreenState;
}

export interface ErrorScreenDetectorDispatchProps {
    showError(type: ErrorScreenType): void;
    hideError(): void;
}

export default class ErrorScreen extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { renderError: false };
    }

    public componentDidMount(): void {
        window.addEventListener('unhandledrejection', this.errorListener);
        window.addEventListener('error', this.errorListener);

        const httpInterceptorId = request.interceptors.response.use(
            (response) => response,
            this.httpErrorResponseInterceptor,
        );
        this.setState({ httpInterceptorId });
    }

    public componentWillUnmount(): void {
        window.removeEventListener('unhandledrejection', this.errorListener);
        window.removeEventListener('error', this.errorListener);

        if (null != this.state.httpInterceptorId) {
            request.interceptors.response.eject(this.state.httpInterceptorId);
            this.setState({ httpInterceptorId: undefined });
        }
    }

    public static getDerivedStateFromError(): State {
        return { renderError: true };
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        this.props.showError(ErrorScreenType.CLIENT_ERROR);
    }

    public render() {
        const { error, children } = this.props;
        const { renderError } = this.state;

        if (null === error.type && !renderError) {
            return children;
        }

        const reloadButton = (
            <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={this.reload}
            >
                刷新页面
            </Button>
        );

        const ignoreButton = (
            <Button
                type="dashed"
                icon={<CloseOutlined />}
                onClick={this.props.hideError}
            >
                关闭
            </Button>
        );

        const buttons = (
            <>
                {reloadButton} {ignoreButton}
            </>
        );

        switch (renderError ? ErrorScreenType.CLIENT_ERROR : error.type) {
            case ErrorScreenType.CLIENT_ERROR:
                return (
                    <Result
                        status="error"
                        title="应用程序出错"
                        subTitle="应用程序中发生未处理的异常"
                        extra={buttons}
                    />
                );
            case ErrorScreenType.SERVER_ERROR:
                return (
                    <Result
                        status="500"
                        title="服务器错误"
                        subTitle="服务器发生错误"
                        extra={buttons}
                    />
                );
            default:
                return children;
        }
    }

    private reload = () => window.location.reload();

    private errorListener = (e: any) => {
        // this.props.showError(ErrorScreenType.CLIENT_ERROR);
    };

    private httpErrorResponseInterceptor = (error: {
        response?: AxiosResponse;
    }) => {
        if (error.response && error.response.status >= 500) {
            this.props.showError(ErrorScreenType.SERVER_ERROR);
        }

        return Promise.reject(error);
    };
}

type Props = ErrorScreenStateProps & ErrorScreenDetectorDispatchProps;

interface State {
    renderError: boolean;
    httpInterceptorId?: number;
}
