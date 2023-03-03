import React, { FC } from 'react';
import ComeOutForm from './ModalForm/ComeOutForm';
import MonthlyForm from './ModalForm/MonthlyForm';
import CurrencyExchangeForm from './ModalForm/CurrencyExchangeForm';
import StartForm from './ModalForm/StartForm';
import './index.scoped.scss';

type LiquidationProps = {};

const Liquidation: FC<LiquidationProps> = (props) => {
    return (
        <div className="m-liquidation-box">
            <div className="m-liquidation-btn">
                <ComeOutForm></ComeOutForm>
            </div>
            <div className="m-liquidation-btn">
                <MonthlyForm></MonthlyForm>
            </div>
            <div className="m-liquidation-btn">
                <CurrencyExchangeForm></CurrencyExchangeForm>
            </div>
            <div className="m-liquidation-btn">
                <StartForm></StartForm>
            </div>
        </div>
    );
};

export default Liquidation;
