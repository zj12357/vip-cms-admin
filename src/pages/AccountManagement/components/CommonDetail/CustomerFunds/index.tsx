import React, { FC } from 'react';
import DepositForm from './ModalForm/DepositForm';
import Withdraw from './ModalForm/WithdrawForm';
import Transfer from './ModalForm/TransferForm';
import Freeze from './ModalForm/FreezeForm';
import ThawForm from './ModalForm/ThawForm';
import GiveMarker from './ModalForm/GiveMarkerForm';
import SiteVerification from './ModalForm/SiteVerificationForm';
import './index.scoped.scss';

type CustomerFundsProps = {};

const CustomerFunds: FC<CustomerFundsProps> = (props) => {
    return (
        <div className="m-customer-funds-box">
            <div className="m-customer-funds-btn">
                <DepositForm></DepositForm>
            </div>
            <div className="m-customer-funds-btn">
                <Withdraw></Withdraw>
            </div>
            <div className="m-customer-funds-btn">
                <Transfer></Transfer>
            </div>
            <div className="m-customer-funds-btn">
                <Freeze></Freeze>
            </div>
            <div className="m-customer-funds-btn">
                <ThawForm></ThawForm>
            </div>

            <div className="m-customer-funds-btn">
                <GiveMarker></GiveMarker>
            </div>

            <div className="m-customer-funds-btn">
                <SiteVerification></SiteVerification>
            </div>
        </div>
    );
};

export default CustomerFunds;
