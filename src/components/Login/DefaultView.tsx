import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../redux/store/app.store';
import { useNavigate } from 'react-router';
import DashboardPage from '../dashboard/DashboardPage';
import userService from '../../services/api-services/user.service';
import Spinner from '../ui-components/Spinner';

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
    const navigate = useNavigate();

    const [checkingOnboard, setCheckingOnboard] = useState<boolean>(true);

    const isUserOnboarded = useCallback(async (walletAddress: string) => {
        const onBoarding = await userService.findOnBoarding(walletAddress);
        if (onBoarding) navigate('/onboarding');
        setCheckingOnboard(false);
        return onBoarding;
    }, []);

    useEffect(() => {
        const walletAddress = window.ethereum.selectedAddress;
        if (userData.account === null || walletAddress == null) navigate('/login');
    }, [userData]);

    useEffect(() => {
        const walletAddress = window.ethereum.selectedAddress;
        if (walletAddress) isUserOnboarded(walletAddress);
        else setCheckingOnboard(false);
    }, [isUserOnboarded]);

    if (checkingOnboard) return <Spinner />;

    return <DashboardPage />;
}
