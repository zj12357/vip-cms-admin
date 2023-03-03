export interface Page<T = any> extends T {
    page?: number;
    size?: number;
    keyword?: string;
}
// 分页数据
export interface ResponsePageData<T = any, U = any> extends Page<U> {
    list: T;
    total: number;
}

// 基础结构
export interface ResponseBaseProps {
    id?: number | string;
    created_at?: number;
    created_by?: number;
    updated_at?: number;
    updated_by?: number;
}

export interface AnnouncementProps extends ResponseBaseProps {
    title?: {
        cn?: string;
        kr?: string;
        en?: string;
        [key: string]: string;
    };
    content?: {
        cn?: string;
        kr?: string;
        en?: string;
        [key: string]: string;
    };
    type?: string;
    type_array?: string[];
    start_at?: number;
    ended_at?: number;
    index?: number;
    created_by_account?: string;
}

// 局管理
export interface GamingProps extends ResponseBaseProps {
    game_no?: string;
    created_at?: number;
    club_id?: number;
    desk_id?: number;
    desk_no?: string;
    game_mod?: number; // 游戏类型[1:快速投|2:传统|3:包桌]
    bank1?: string; // 庄1
    bank2?: string; // 庄2
    bank3?: string; // 庄3
    player1?: string; // 闲1
    player2?: string; // 闲2
    player3?: string; // 闲3
    bank_point?: number;
    player_point?: number;
    result?: number;
    pair?: number;
    ended_at?: number; // 结算时间
    shoe_game_no?: string;
    shoe_no?: string;
    is_updated?: number;
    updated_by?: number;
    update_log?: string;
    is_settle?: number; // 是否结算[1:已结算|2:未结算]
    result_msg?: string;
}

// 注单管理
export interface BetProps extends ResponseBaseProps {
    bet_id?: number;
    player_id?: number;
    amount?: number; // 金额
    balance?: number;
    desk_no?: string; //桌台
    game_no?: string; // 局号
    game_mod?: number; // 游戏类型[1:快速投｜2:传统｜3:包桌]
    status?: number;
    is_settle?: number; // 是否结算[1:已结算｜2:未结算]
    better_id?: number;
    game_type?: number; // '玩法[1:庄｜2:闲｜3:和｜4:庄对｜5:闲对]'
    prize?: number;
    win_amount?: number; // 输赢
    commission?: number; // 转码
    trade_type_id?: number;
    player_account?: string;
    currency?: number;
    confirm_amount?: number;
    bet_no?: string; // 注单编号
    game_result?: number;
    refuse_note?: string;
}

// 代理电话配置
export interface AgentPhoneProps extends ResponseBaseProps {
    hotline1: string;
    hotline2: string;
    'game-hotline1': string;
    'game-hotline2': string;
}

// 电投手管理
export interface BetterProps extends ResponseBaseProps {
    better_id?: number;
    online_status?: number; // 在线状态 1离线 2在线
    desk_code?: string;
    desk_id?: number;
    account?: string; // 账号
    employee_name?: string; // 员工姓名
    mobile?: string; // 联系电话
    status?: number; // 1禁用 2启用
    operation_name?: string; // 创建人
    operation_id?: number;
    password?: string;
    last_login_time?: number; // 最后登录时间
}

// 贵宾厅
export interface VipClubProps extends ResponseBaseProps {
    name?: string;
}
// 贵宾厅-桌台
export interface VipClubDeskProps extends ResponseBaseProps {
    desk_id?: number;
    desk_no?: string;
    status?: number;
    club_id?: number;
    shoe_no?: number;
    video_url?: string;
    limit_id?: number;
    game_mod?: number;
    video_url2?: string;
}
// 桌台限红数据
export interface LimitDeskProps extends ResponseBaseProps {
    type?: number; // 1 --- 用户限红 2 --- 桌台限红
    desk_id?: number; // 如果是桌台限红，需要添加桌台id
    limit_array?: {
        min_amount?: number;
        max_amount?: number;
        bet_type?: number;
        [key: string]: any;
    }[];
}
// 桌台参数
export interface ClubDeskProps extends ResponseBaseProps {
    desk_id?: number;
    desk_no?: string;
    status?: number; // 1禁用 3维护
    club_id?: number;
    shoe_no?: string;
    video_url?: string;
    game_mod?: number;
}

// 用户限红参数管理
export interface BetLimitUser extends ResponseBaseProps, LimitDeskProps {
    status?: number; // 1启动。2禁用
}

// 提案管理
export interface ArchiveProps extends ResponseBaseProps {
    member_account?: string; // 会员
    start_at?: number; // 提案开始时间
    ended_at?: number; // 提案归档时间
    win_amount?: number; // 上下数
    commission?: number; // 转码量
    tip?: number; // 小费
    currency_code?: string; // 币种
    commission_rate?: number; // 转码比
    share_rate?: number; // 占成比
}
export interface ArchiveBetDetail extends ResponseBaseProps {
    player_account?: string; // 会员账号
    game_no?: string; // 局号
    bet_no?: string;
    club_id?: number; // 贵宾厅
    desk_no?: string; // 桌台
    game_mod?: number; // 游戏类型[1:快速投｜2:传统｜3:包桌]
    game_type?: number; // 玩法[1:庄｜2:闲｜3:和｜4:庄对｜5:闲对]
    currency?: number; // 币种
    amount?: number; // 金额
    // 游戏结果
    win_amount?: number; // 输赢
    commission?: number; // 转码
    updated_at?: string; // 结算时间
}

// 桌台即时概况
export interface DeskOverviewProps extends ResponseBaseProps {
    desk_no?: string;
    game_mod?: number; // 游戏类型[1:快速投｜2:传统｜3:包桌]
    desk_status?: number; // 状态1禁用 2游戏中 3维护 4换靴
    better_logs?: BetterLog[];
}

// 电投手报表
export interface BetterLog extends ResponseBaseProps, Record<string, any> {
    better_id?: number;
    chips_st?: number; // 入场泥码
    cash_chips_st?: number; // 入场现金码
    zm_amount_st?: number; // 入场转码值
    bet_total_st?: number; // 入场投注
    cash_chips?: number; // 离场现金码
    chips?: number; // 离场泥码
    bet_total?: number; // 离场投注
    zm_amount?: number; // 离场转码值
    net_chips?: number; // 净泥码
    net_cash_chips?: number; // 净现金码
    net_zm_amount?: number; // 净转码值
    net_bet_total?: number; // 净总投注
    employee_name?: string;
    account?: string; // 账号
    tip?: number; // 小费
}

// 转码参数管理
export interface CommissionConfigProps extends ResponseBaseProps {
    rebate_id?: number;
    currency?: number;
    amount?: number;
}

// 一级代理限红配置
export interface TopAgentLimitProps extends ResponseBaseProps {
    member_id?: number;
    member_code?: string;
    member_account?: string;
    limit_id?: number;
    limits?: string;
}
