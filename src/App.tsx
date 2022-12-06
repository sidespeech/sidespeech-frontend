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
import Spinner from './components/ui-components/Spinner';

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

	const [onboarding, setCheckingOnboarding] = useState<boolean>(true);
	const [fetchingUser, setFetchingUser] = useState<boolean>(true);

	const isUserOnboarded = useCallback(async (walletAddress: string) => {
		try {
			const onBoarding = await userService.findOnBoarding(walletAddress);
			if (onBoarding) navigate('/onboarding');
			return onBoarding;
		} catch (error) {
			console.error(error);
		} finally {
			setCheckingOnboarding(false);
		}
	}, []);

	useEffect(() => {
		if (!onboarding && !fetchingUser) {
			if (userData.account === null)
				navigate('/login', {
					state: {
						redirectFrom: location.pathname
					}
				});
			if (location.pathname === '/login' && userData.account) navigate(location.state?.redirectFrom || '/');
		}
	}, [fetchingUser, onboarding, userData]);

	useEffect(() => {
		if (walletAddress) isUserOnboarded(walletAddress);
		else setCheckingOnboarding(false);
	}, [isUserOnboarded]);

	useEffect(() => {
		websocketService.connectToWebSocket();

		async function getUser(account: string) {
			try {
				setFetchingUser(true);
				const user = await userService.getUserByAddress(account);
				dispatch(connect({ account: account, user: user }));
				dispatch(fetchUserDatas(account));
			} catch (error) {
				console.error(error);
				toast.error('Ooops! Something went wrong fetching your account data', { toastId: getRandomId() });
			} finally {
				setFetchingUser(false);
			}
		}

		// This is needed because the metamask extension connection isn't picked up on just normal useEffect after refresh.
		window.onload = event => {
			const addressFromLocalStorage = localStorage.getItem('userAccount');
			if (localStorage.getItem('jwtToken') && (walletAddress || addressFromLocalStorage))
				getUser(walletAddress || addressFromLocalStorage);
			else {
				setTimeout(() => {
					if (localStorage.getItem('jwtToken') && (walletAddress || addressFromLocalStorage))
						getUser(walletAddress || addressFromLocalStorage);
					else setFetchingUser(false);
				}, 1000);
			}
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
			{onboarding || fetchingUser ? (
				<div style={{ height: '100vh', width: '100%', display: 'grid', placeItems: 'center' }}>
					<Spinner />
				</div>
			) : (
				<Outlet
					context={{
						isSettingsMobileMenuOpen,
						setIsSettingsMobileMenuOpen
					}}
				/>
			)}
		</Layout>
	);
}

export function useGeneralSettingsContext() {
	return useOutletContext<GeneralSettingsAccountContext>();
}

export default App;
