import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

// Redux
import { connect, fetchUserDatas } from './redux/Slices/UserDataSlice';

// API's
import userService from './services/api-services/user.service';
import websocketService from './services/websocket-services/websocket.service';

// Components
import Layout from './components/ui-components/Layout';

// Utilities
import { getRandomId } from './helpers/utilities';

// Styles
import './App.css';
import { RootState } from './redux/store/app.store';
import useOpenseaCollection from './hooks/useOpenseaData';

export interface GeneralSettingsAccountContext {
	isSettingsMobileMenuOpen?: boolean;
	setIsSettingsMobileMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const walletAddress = window.ethereum.selectedAddress || null;

function App() {
	const [isSettingsMobileMenuOpen, setIsSettingsMobileMenuOpen] = useState<boolean>(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const userData = useSelector((state: RootState) => state.user);

	const [checkingOnboard, setCheckingOnboard] = useState<boolean>(true);

	const isUserOnboarded = useCallback(async (walletAddress: string) => {
		const onBoarding = await userService.findOnBoarding(walletAddress);
		if (onBoarding) navigate('/onboarding');
		setCheckingOnboard(false);
		return onBoarding;
	}, []);

	useEffect(() => {
		if (userData.account === null) navigate('/login');
		if (location.pathname === '/login' && userData.account) navigate('/');
	}, [userData]);

	useEffect(() => {
		if (walletAddress) isUserOnboarded(walletAddress);
		else setCheckingOnboard(false);
	}, [isUserOnboarded]);

	useEffect(() => {
		websocketService.connectToWebSocket();

		async function getUser(account: string) {
			try {
				const user = await userService.getUserByAddress(account);
				dispatch(connect({ account: account, user: user }));
				dispatch(fetchUserDatas(account));
			} catch (error) {
				console.error(error);
				toast.error('Ooops! Something went wrong fetching your account data', { toastId: getRandomId() });
			}
		}

		// This is needed because the metamask extension connection isn't picked up on just normal useEffect after refresh.
		window.onload = event => {
			const connectedWallet = window.ethereum.selectedAddress ? window.ethereum.selectedAddress : null;

			if (localStorage.getItem('jwtToken') && connectedWallet) getUser(connectedWallet);
		};

		return () => {
			websocketService.deconnectWebsocket();
		};
	}, []);

	return (
		<Layout
			generalSettings
			isSettingsMobileMenuOpen={isSettingsMobileMenuOpen}
			setIsSettingsMobileMenuOpen={setIsSettingsMobileMenuOpen}
		>
			<Outlet
				context={{
					isSettingsMobileMenuOpen,
					setIsSettingsMobileMenuOpen
				}}
			/>
		</Layout>
	);
}

export function useGeneralSettingsContext() {
	return useOutletContext<GeneralSettingsAccountContext>();
}

export default App;
