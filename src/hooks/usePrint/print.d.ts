import { ReactNode } from 'react';

export type MarkerDataProps = {
    id?: string; // 编号
    borrower: string; // 借款人
    borrowAccount: string; // 借款户口
    amountCapital: string; // 金额
    amountCurrency: string; // 金额，万
    currency: string; // 币种
    repaymentDate: string; // 还款日期
    interest: string; // 违约利息
    remark: string; // 备注
    // publicRelations: string; // 公关签署
    // accountRoom: string; // 账房签署
    // borrowerSign: string; // 借款人签署
};

export type OfficialDataProps = {
    id?: string; // 编号
    name: string; // 姓名
    account: string; // 户口
    type: string; // 类型
    currency: string; // 币种
    amountCapital: string; // 金额
    amountCurrency: string; // 金额，万
    remark: string; // 备注
    manager: string; // 经办人签署
};

export type TicketDataProps = {
    title?: ReactNode;
    items: Record<string, ReactNode>[];
};

export interface TemplateTypeWithFieldProps {
    Marker: MarkerDataProps;
    Official: OfficialDataProps;
    Ticket: TicketDataProps;
}

export declare type TemplateType = Extract<
    keyof TemplateTypeWithFieldProps,
    any
>;

declare type ValueTypeWithFieldPropsBase<Type> = {
    templateType: Type;
    templateProps?: TemplateTypeWithFieldProps[TemplateType];
    getData?: () => Promise<
        TemplateTypeWithFieldProps[TemplateType] | undefined
    >;
};
declare type UnionSameTemplateType<Type> = Type extends any
    ? Type extends TemplateType
        ? never
        : Type
    : never;
export declare type TemplateTypeWithPrintProps<Type> =
    ValueTypeWithFieldPropsBase<
        TemplateType | UnionSameTemplateType<Type> | undefined
    >;

export declare type PrintSchema<Type = 'Marker'> =
    TemplateTypeWithPrintProps<Type>;
export declare type PrintTemplateType<Type = 'Marker'> = PrintSchema<Type> & {
    trigger?: ReactNode;
    visible?: boolean;
};
export {};
