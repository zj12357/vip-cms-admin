import React, { FC, useState, useEffect, memo } from 'react';
import { ProFormInstance } from '@ant-design/pro-components';
import { Row, Col, Checkbox, message } from 'antd';
import { useHttp } from '@/hooks';
import { getMarkerCredit } from '@/api/account';
import { GetMarkerCreditParams, MarkerCreditType } from '@/types/api/account';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import _ from 'lodash';
import { useAppSelector } from '@/store/hooks';
import { selectAccountInfo } from '@/store/account/accountSlice';
import FormCurrency from '@/components/Currency/FormCurrency';
import { mCreditType } from '@/common/commonConstType';

type PrincipalFormProps = {
    formRef: React.MutableRefObject<ProFormInstance<any> | undefined>;
    setMarkerList: (val: number[]) => void;
    totalOutCode: () => void;
};
interface MoptionsType {
    label: string;
    value: number;
}

const PrincipalForm: FC<PrincipalFormProps> = memo(
    ({ formRef, setMarkerList, totalOutCode }) => {
        const accountInfo = useAppSelector(selectAccountInfo);

        const [quotaCheckList, setQuotaCheckList] = useState<number[]>([]);

        const { fetchData: _fetchMarkerCredit } = useHttp<
            GetMarkerCreditParams,
            MarkerCreditType
        >(getMarkerCredit);

        const handleQuotaCheck = async (
            e: CheckboxChangeEvent,
            type: MoptionsType,
        ) => {
            const currency = formRef.current?.getFieldValue('currency');
            if (!currency) {
                message.error('请先选择开工币种!');
                return;
            }

            if (e.target.checked) {
                setQuotaCheckList(_.uniq([...quotaCheckList, type.value]));
                const { data } = await handleMarkerCredit(type.value, currency);
                formRef.current?.setFieldsValue({
                    [`usable-${type.value}`]: data?.available_amount ?? 0,
                });
            } else {
                setQuotaCheckList(
                    quotaCheckList.filter((item) => item !== type.value),
                );
                formRef.current?.setFieldsValue({
                    [`codeOut-${type.value}`]: '',
                });
            }
            totalOutCode();
        };

        const handleMarkerCredit = (type: number, currency: number) => {
            const params = {
                member_code: accountInfo.member_code,
                currency,
                marker_type: type,
            };
            return _fetchMarkerCredit(params);
        };

        useEffect(() => {
            setMarkerList(quotaCheckList);
        }, [quotaCheckList, setMarkerList]);

        return (
            <Row justify="start">
                {mCreditType.map((item, index) => {
                    return (
                        <Col
                            span={6}
                            offset={1}
                            key={item.value}
                            style={{
                                marginBottom: '20px',
                            }}
                        >
                            <Checkbox
                                onChange={(e) => {
                                    handleQuotaCheck(e, item);
                                }}
                            >
                                {item.label}
                            </Checkbox>
                            {quotaCheckList.includes(item.value) && (
                                <>
                                    <div
                                        style={{
                                            marginBottom: '8px',
                                        }}
                                    >
                                        <span>{item.label}-可用额度</span>

                                        <FormCurrency
                                            width="md"
                                            name={`usable-${item.value}`}
                                            disabled
                                            placeholder={''}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            marginBottom: '8px',
                                        }}
                                    >
                                        <span>{item.label}-出码额度</span>

                                        <FormCurrency
                                            width="md"
                                            name={`codeOut-${item.value}`}
                                            placeholder={`请输入${item.label}出码额度`}
                                            fieldProps={{
                                                onChange: (e) => {
                                                    totalOutCode();
                                                },
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                        </Col>
                    );
                })}
            </Row>
        );
    },
);

export default PrincipalForm;
