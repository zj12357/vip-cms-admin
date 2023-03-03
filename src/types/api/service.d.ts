import { ConsumeListItem } from './accountAction';

export interface ConsumListParams {
    venue?: string;
    currency?: string;
}
export interface GetConsumDetailParams {
    id: string;
}

export interface ConsumeItem {
    consume_type: number;
    item_name: string;
    item_count: number;
    item_price: number;
    item_subtotal: number;
}
export interface AddConsumParams {
    account: string;
    account_name: string;
    customer_name: string;
    venue_type: number;
    currency_type: number;
    consume_item_detail_list: Array<ConsumeItem>;
    consume_item_total: number;
    payment_type: number;
    operator?: string;
    department?: string;
    remark?: string;
}

interface OrderItemDetailItem {
    id: string;
    order_number: string;
    consume_type: number;
    item_name: string;
    item_count: number;
    item_price: number;
    item_subtotal: number;
    sub_order_status: number;
    create_time: number;
    creator: string;
}
export interface UpdateConsumParams {
    order_info: {
        id: string;
        venue_type: number;
        order_number: string;
        account: string;
        account_name: string;
        customer_name: string;
        currency_type: number;
        payment_type: number;
        order_amount: number;
        order_status: number;
        department: string;
        approval_flag: true;
        operator: string;
        create_time: number;
        creator: string;
    };
    order_item_detail: Array<OrderItemDetailItem>;
}

export interface ChargebackParams {
    id: string;
    refund_list: Array<string>;
}

export interface QueryAccountParams {
    account: string;
    currency_type: number;
}
export interface CreateConsumeConfigParams {
    venue_type: number;
    currency_type: number;
    consume_type: number;
    consume_keyword: string;
    item_name: string;
    item_price: number;
    remark?: string;
}

export interface UpdateConsumeConfigParams {
    id: string;
    venue_type: number;
    currency_type: number;
    consume_type: number;
    consume_keyword: string;
    item_name: string;
    item_price: number;
    remark?: string;
}

export interface GetConsumConfigListParams {
    venue_type?: number;
    currency_type?: number;
    consume_type?: number;
    consume_keyword?: string;
    page: number;
    size: number;
}
export interface DeleteConfigItemParams {
    id: string;
}

export interface ConsumCancelParams {
    id: string;
}
export interface ConsumApprovalParams {
    id: string;
    result: 1 | 0;
}

export interface IntegralListParams {
    account: string;
    account_name: string;
    page: number;
    size: number;
}
export interface IntegralDetailParams {
    account: string;
    page: number;
    size: number;
}

export interface GiftsListParams {
    account: string;
    account_name: string;
    page: number;
    size: number;
}

export interface GiftsDetailParams {
    account: string;
    page: number;
    size: number;
}

export interface GetCompanyBalanceParams {
    hall: number;
    member_code: string;
    currency_id: number;
}
