import React, { useEffect, useMemo, useState } from 'react';
import { PrintTemplateType, TicketDataProps } from '@/hooks/usePrint/print';
import usePrint from '@/hooks/usePrint';
import { PrintChipsProps } from '@/types/api/admission';
import moment from 'moment/moment';
import { formatCurrency } from '@/utils/tools';
import TicketFactory from '@/components/Print/TicketTemplate';

export declare type PrintProps<Type = 'Marker'> = PrintTemplateType<Type>;

// 转码-接口数据转化 (2 转码, 3 加彩, 4 回码, 9 收工)
export const formatChips = (data: PrintChipsProps): TicketDataProps => {
    const obj = {
        account: data?.member_code!,
        type: data?.convert_chips_type!,
        time: moment(data?.created_at! * 1000).format('YYYY-MM-DD hh:mm'),
        archiveNo: data?.round,
        amount: `${formatCurrency(data?.amount!)}万`,
        commission: `${formatCurrency(data?.convert_chips!)}万`,
        totalConvertChips: `${formatCurrency(data?.total_convert_chips!)}万`,
    };
    return {
        title: '盈樂貴賓會',
        items: TicketFactory.create(obj),
    };
};

export const Print: React.FC<PrintProps> = ({
    templateType,
    templateProps,
    getData,
    trigger,
    visible = true,
}) => {
    const [data, setData] = useState<typeof templateProps>();
    const { RegisterPrint, handlePrint } = usePrint(templateType);
    const handleClick = async () => {
        const res = await getData?.();
        setData(res);
    };
    const entity = useMemo(() => {
        if (data) {
            return data;
        }
        return templateProps;
    }, [data, templateProps]);
    useEffect(() => {
        if (entity) {
            handlePrint(entity);
        }
    }, [entity, handlePrint]);
    return visible ? (
        <>
            {trigger && <span onClick={() => handleClick()}>{trigger}</span>}
            <RegisterPrint />
        </>
    ) : (
        <></>
    );
};

export default Print;
