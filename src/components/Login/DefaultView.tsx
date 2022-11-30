import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../redux/store/app.store';
import Login from './Login';
import { useNavigate } from 'react-router';
import DashboardPage from '../dashboard/DashboardPage';
import { Side } from '../../models/Side';
import userService from '../../services/api-services/user.service';

interface ISeparatorHorizontal {
    borderColor?: string;
    margin?: string;
}

export const SeparatorHorizontal = styled.div<ISeparatorHorizontal>`
    min-width: 535px;
    border-top: 1px solid ${(props) => (props.borderColor ? props.borderColor : 'var(--disable)')};
    margin: ${(props) => (props.margin ? props.margin : '34px 0px 50px 0px')}; ;
`;

export default function DefaultView() {
    const userData = useSelector((state: RootState) => state.user);
    const walletAddress = window.ethereum.selectedAddress;
    const navigate = useNavigate();

    let initialPage;

    if (userData.account === null || walletAddress == null) {
        initialPage = <Login />;
    } else if (walletAddress) {
        const checkOnBoarding = async () => {
            const onBoarding = await userService.findOnBoarding(walletAddress);

            if (onBoarding) {
                //Redirect the user to the onboarding area.
                navigate('/onboarding');
                return false;
            }
        };
        checkOnBoarding();
        initialPage = <DashboardPage />;
    } else {
        initialPage = <DashboardPage />;
    }

    return <>{initialPage}</>;
}
