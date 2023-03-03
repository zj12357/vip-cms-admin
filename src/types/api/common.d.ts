/*
 * @version:  ;
 * @description:  ;
 *
 * @date: Do not edit
 */
export interface ResponseData<T = any> {
    /**
     * 状态码
     * @type { number }
     */
    code: number;

    /**
     * 数据
     * @type { T }
     */
    data: T;

    /**
     * 消息
     * @type { string }
     */
    msg: string;
}

//分页类型
export interface CommonList<T = any> {
    /**
     * 数据
     * @type { T }
     */
    list: T[];

    /**
     * 数量
     * @type { number }
     */
    total: number;
}

export interface Page<T = any> extends T {
    page?: number;
    size?: number;
}
