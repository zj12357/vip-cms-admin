import { chipType } from '@/common/commonConstType';

export type TicketProps = {
    type: number; // 操作类型
    account: string; // 客户账号
    time: string; // 转账时间
    amount: string; // 金额
    archiveNo?: string; // 提案编号
    commission?: string | number; // 转码量
    totalConvertChips?: string | number; // 总转码
    receiverAccount?: string; // 收款方账号
    receiverName?: string; // 收款方姓名
};

export class TicketFactory {
    private constructor() {}

    public static create(data: TicketProps) {
        const name = chipType.find((c) => c.value === data.type)?.label;
        let result: any = [];
        switch (data.type) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 9:
                result = [
                    {
                        label: '客户账号',
                        value: data.account,
                    },
                    {
                        label: '操作类型',
                        value: name,
                    },
                    {
                        label: `${name}时间`,
                        value: data.time,
                    },
                    {
                        label: '场次编号',
                        value: data.archiveNo,
                    },
                    {
                        label: `${name}金额`,
                        value: data.amount,
                    },
                    {
                        label: '转码量',
                        value: data.commission,
                    },
                    {
                        label: '总转码',
                        value: data.totalConvertChips,
                    },
                ];
                break;
            default:
                // 默认转账
                result = [
                    {
                        label: '客户账号',
                        value: data.account,
                    },
                    {
                        label: '操作类型',
                        value: data.type,
                    },
                    {
                        label: '收款方账号',
                        value: data.receiverAccount,
                    },
                    {
                        label: '收款方姓名',
                        value: data.receiverName,
                    },
                    {
                        label: '金额',
                        value: data.amount,
                    },
                    {
                        label: '转账时间',
                        value: data.time,
                    },
                ];
                break;
        }
        if (data.type === 2) {
            result.splice(-3, 1);
        }
        return result;
    }
}

export default TicketFactory;
