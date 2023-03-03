import { default as Marker } from '@/hooks/usePrint/templates/Marker';
import { default as Official } from '@/hooks/usePrint/templates/Official';
import { default as Ticket } from '@/hooks/usePrint/templates/Ticket';
import React from 'react';
import {
    MarkerDataProps,
    OfficialDataProps,
    TicketDataProps,
} from '@/hooks/usePrint/print';

export interface RegisterPrintProps {
    Marker: React.FC<{
        data: MarkerDataProps;
    }>;
    Official: React.FC<{
        data: OfficialDataProps;
    }>;
    Ticket: React.FC<{
        data: TicketDataProps;
    }>;
}

export default [
    // 借款单模版
    {
        key: 'Marker',
        component: Marker,
    },
    // 收据模版
    {
        key: 'Official',
        component: Official,
    },
    // 小票模版
    {
        key: 'Ticket',
        component: Ticket,
    },
];
