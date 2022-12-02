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
import Spinner from './components/ui-components/Spinner';
import { RootState } from './redux/store/app.store';

export interface GeneralSettingsAccountContext {
	isSettingsMobileMenuOpen?: boolean;
	setIsSettingsMobileMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const walletAddress = window.ethereum.selectedAddress;

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
		if (userData.account === null || walletAddress == null) navigate('/login');
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
			const connectedWallet = walletAddress || null;

			if (localStorage.getItem('jwtToken') && connectedWallet) getUser(connectedWallet);
		};

		return () => {
			websocketService.deconnectWebsocket();
		};
	}, []);

	return (
		<>
			{checkingOnboard ? (
				<div
					style={{ margin: '0 auto', height: '100vh', gap: '5rem' }}
					className="w-100 f-column align-center justify-center"
				>
					<svg width="79" height="77" viewBox="0 0 79 77" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M45.0267 30.9182L35.9696 30.8997C31.7922 30.8997 28.3912 27.5013 28.3912 23.3272V22.7731C28.3912 18.5989 31.7922 15.2005 35.9696 15.2005H79C75.3402 9.05013 70.4604 3.84169 64.4347 0H35.9511C23.3821 0 13.179 10.2137 13.179 22.7546V23.3087C13.179 25.9683 13.6411 28.5172 14.4913 30.8997C17.6336 39.7282 26.0622 46.0818 35.9696 46.0818L45.0267 46.1003C49.204 46.1003 52.6051 49.4987 52.6051 53.6728V54.2269C52.6051 58.4011 49.204 61.7995 45.0267 61.7995H0C3.6598 67.9499 8.59499 73.1583 14.6207 77H45.0082C57.5772 77 67.7803 66.7863 67.7803 54.2454V53.6913C67.7803 51.0317 67.3182 48.4829 66.4679 46.1003C63.3627 37.2718 54.9155 30.9182 45.0267 30.9182Z"
							fill="var(--primary)"
						/>
					</svg>
					<Spinner />
				</div>
			) : (
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
			)}
		</>
	);
}

export function useGeneralSettingsContext() {
	return useOutletContext<GeneralSettingsAccountContext>();
}

export default App;
