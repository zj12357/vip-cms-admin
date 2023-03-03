import React, { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Row, Col, Typography, Divider } from 'antd';
import { useHttp } from '@/hooks';
import { getAccountDetail } from '@/api/admission';
import { GetAccountDetailParams, AccountDetails } from '@/types/api/admission';
import { admissionType, workType } from '@/common/commonConstType';
import { useAppSelector } from '@/store/hooks';
import { selectCurrencyList } from '@/store/common/commonSlice';
const { Title } = Typography;

interface Data {
    label: string;
    value: number;
}
type Props = {
    round?: string;
    getTable_bottom_multiple?: (multiple: number) => void;
    span?: number;
};
interface Details {
    customer_name: string;
    table_num: string;
    member_code: string;
    member_name: string;
    round: string;
    admission_type: number;
    currency: number;
    start_work_type: number;
    principal_type: string;
    shares_type: string;
    shares_rate: string;
    shares_bottom_rate?: string;
}

const ModalHead: FC<Props> = ({
    round,
    getTable_bottom_multiple,
    span = 8,
}) => {
    const currencyList = useAppSelector(selectCurrencyList);
    const params = useParams();
    const [dataInfo, setDataInfo] = useState<Details>();
    const { fetchData: getAccountDetailData } = useHttp<
        GetAccountDetailParams,
        AccountDetails
    >(getAccountDetail);
    useEffect(() => {
        getAccountDetailData({ round: params.id || round || '' }).then(
            (res: any) => {
                if (res.code === 10000) {
                    setDataInfo(res.data);
                    if (getTable_bottom_multiple) {
                        getTable_bottom_multiple(
                            res.data.table_bottom_multiple,
                        );
                    }
                }
            },
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const getLabel = (data: Array<Data>, value: number) => {
        return data.find((item) => item.value === value)?.label;
    };
    return (
        <>
            <Row justify="space-between">
                <Col>
                    <Title level={5}>客户：{dataInfo?.customer_name}</Title>
                </Col>
                <Col>
                    <Title level={5}>桌号：{dataInfo?.table_num}</Title>
                </Col>
            </Row>
            <Row gutter={[24, 10]} style={{ marginBottom: '-12px' }}>
                <Col span={span}>
                    户口号：<span>{dataInfo?.member_code}</span>
                </Col>
                <Col span={span}>
                    名称：<span>{dataInfo?.member_name}</span>
                </Col>
                <Col span={span}>
                    场次：<span>{dataInfo?.round}</span>
                </Col>
                <Col span={span}>
                    入场类型：
                    <span>
                        {dataInfo?.admission_type &&
                            getLabel(admissionType, dataInfo?.admission_type)}
                    </span>
                </Col>
                <Col span={span}>
                    开工币种：
                    <span>
                        {dataInfo?.currency &&
                            getLabel(currencyList, dataInfo?.currency)}
                    </span>
                </Col>
                <Col span={span}>
                    开工类型：
                    <span>
                        {dataInfo?.start_work_type &&
                            getLabel(workType, dataInfo?.start_work_type)}
                    </span>
                </Col>
                <Col span={span}>
                    出码类型：
                    <span>{dataInfo?.shares_type}</span>
                </Col>
                <Col span={span}>
                    本金类型：
                    <span>{dataInfo?.principal_type}</span>
                </Col>
                <Col span={span}>
                    占成数：
                    <span>
                        {`${dataInfo?.shares_rate}%, ${dataInfo?.shares_bottom_rate}%`}
                    </span>
                </Col>
            </Row>
            <Divider dashed />
        </>
    );
};

export default ModalHead;
