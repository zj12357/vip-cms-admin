import React, { FC } from 'react';
import AccountSettingForm from './ModalForm/AccountSettingForm';
import BatchSettingForm from './ModalForm/BatchSettingForm';
import ModifyAccountForm from './ModalForm/ModifyAccountForm';
import ModifyCompanyForm from './ModalForm/ModifyCompanyForm';
import SetPasswordForm from './ModalForm/SetPasswordForm';
import { useAppSelector } from '@/store/hooks';
import { selectAccountType } from '@/store/account/accountSlice';
import './index.scoped.scss';

type AccountInfoProps = {};

const AccountInfo: FC<AccountInfoProps> = (props) => {
    const accountType = useAppSelector(selectAccountType);
    return (
        <>
            <div className="m-account-info-box">
                <div className="m-account-info-btn">
                    <AccountSettingForm></AccountSettingForm>
                </div>

                <div className="m-account-info-btn">
                    <BatchSettingForm></BatchSettingForm>
                </div>

                {accountType === 1 && (
                    <div className="m-account-info-btn">
                        <ModifyCompanyForm></ModifyCompanyForm>
                    </div>
                )}
                {accountType === 2 && (
                    <div className="m-account-info-btn">
                        <ModifyAccountForm></ModifyAccountForm>
                    </div>
                )}

                <div className="m-account-info-btn">
                    <SetPasswordForm></SetPasswordForm>
                </div>
            </div>
        </>
    );
};

export default AccountInfo;
