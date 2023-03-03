import React, { FC, useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import AccountDetails from './components/AccountDetails';
import ClientDetails from './components/ClientDetails';
import MesaInfo from './components/MesaInfo';
import CustomerRemarks from './components/CustomerRemarks';
import { useHttp } from '@/hooks';
import { customerDetail, footerDate } from '@/api/scene';
import { customerDetailParams, FooterDateParams } from '@/types/api/scene';
import './index.scoped.scss';
import { formatCurrency } from '@/utils/tools';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';

type CustomerDetailsProps = {};

interface ConverType {
    currency: number;
    num: number;
}
enum Color {
    blue = 'm-primary-link-color',
    green = 'm-primary-success-color',
    red = 'm-primary-error-color',
}

const CustomerDetails: FC<CustomerDetailsProps> = () => {
    const params = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [loading, setLoading] = useState(false);
    const [resData, setResData] = useState<any>();
    const currencyList = useAppSelector(selectCurrencyList);
    const { fetchData: fetchFooterDate } = useHttp<FooterDateParams, any>(
        footerDate,
    );
    // 页脚转吗数
    const [convertChips, setConvertChips] = useState<Array<ConverType>>([]);
    // 页脚上数
    const [upChips, setUpChips] = useState<Array<ConverType>>([]);
    // 页脚下数
    const [downChips, setDownChips] = useState<Array<ConverType>>([]);

    const { fetchData: fetchCustomerDetail } = useHttp<
        customerDetailParams,
        any
    >(customerDetail);

    const fatherLoading = async () => {
        if (!params.id) {
            return false;
        }
        setLoading(true);
        const res = await fetchCustomerDetail({
            round: params.id,
            start_work_start_time: Number(searchParams.get('start')) || 0,
            start_work_end_time: Number(searchParams.get('end')) || 0,
        });
        if (res.code === 10000) {
            setResData(res.data);
            setLoading(false);
        }
    };

    const getFooterData = () => {
        fetchFooterDate({
            start_work_start_time: Number(searchParams.get('start')) || 0,
            start_work_end_time: Number(searchParams.get('end')) || 0,
            round: params.id,
        }).then((res) => {
            if (res.code === 10000) {
                setConvertChips(res.data.footer_convert_chips);
                setUpChips(res.data.footer_up_chips);
                setDownChips(res.data.footer_down_chips);
            }
        });
    };

    const timerRef = useRef(0);
    useEffect(() => {
        fatherLoading();
        getFooterData();
        timerRef.current = window.setInterval(() => {
            getFooterData();
        }, 10000);
        return () => {
            window.clearInterval(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const footerInfor = (data: Array<ConverType>, color: Color) => {
        return (
            <span>
                {data.length > 0 ? (
                    (data || [])
                        .sort((item, next) => {
                            return item.currency > next.currency ? 1 : -1;
                        })
                        .map((item, index) => {
                            return (
                                <>
                                    <span className={color}>{`${
                                        item.currency !== 0
                                            ? currencyList.find(
                                                  (ele: any) =>
                                                      ele.value ===
                                                      item.currency,
                                              )?.label
                                            : ''
                                    } ${formatCurrency(item.num)}`}</span>
                                    <span>
                                        {index !== data.length - 1 && ` | `}
                                    </span>
                                </>
                            );
                        })
                ) : (
                    <span className={color}>0</span>
                )}
            </span>
        );
    };

    return (
        <div
            style={{
                height: 'calc(100vh - 200px)',
                overflowY: 'auto',
                padding: 0,
                background: '#fff',
            }}
        >
            <div className="s-title">
                <span>户口详情</span>
                <span>客户详情</span>
            </div>
            <div className="s-content">
                <div className="s-left">
                    <AccountDetails resData={resData} />
                </div>
                <div className="s-right">
                    <div className="s-right-content">
                        <ClientDetails
                            resData={resData}
                            round={params.id || ''}
                        />
                        <MesaInfo
                            resData={resData}
                            round={params.id || ''}
                            loading={loading}
                            fatherLoading={() => {
                                fatherLoading();
                                getFooterData();
                            }}
                        />
                        <CustomerRemarks round={params.id || ''} />
                    </div>
                    <div className="s-right-footer">
                        <span className="right-item">
                            转码数(总)：
                            {footerInfor(convertChips, Color.green)}
                        </span>

                        <span className="right-item">
                            上：
                            {footerInfor(upChips, Color.blue)}
                        </span>
                        <span className="right-item">
                            下：
                            {footerInfor(downChips, Color.red)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetails;
