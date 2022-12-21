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
import Spinner from './components/ui-components/Spinner';
import useWalletAddress from './hooks/useWalletAddress';

export interface GeneralSettingsAccountContext {
	isSettingsMobileMenuOpen?: boolean;
	setIsSettingsMobileMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

function App() {
	const [isSettingsMobileMenuOpen, setIsSettingsMobileMenuOpen] = useState<boolean>(false);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { loadingWallet, walletAddress } = useWalletAddress();

	const userData = useSelector((state: RootState) => state.user);

	const [onboarding, setCheckingOnboarding] = useState<boolean>(true);
	const [fetchingUser, setFetchingUser] = useState<boolean>(false);

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
		if (!location.pathname.includes('new-side')) {
			const newSideDraft = sessionStorage.getItem('create-side-data');
			if (newSideDraft) sessionStorage.removeItem('create-side-data');
		}
	}, [location]);

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
		if (!loadingWallet) {
			if (walletAddress) isUserOnboarded(walletAddress);
			else setCheckingOnboarding(false);
		}
	}, [isUserOnboarded, loadingWallet, walletAddress]);

	useEffect(() => {
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

		if (!loadingWallet && localStorage.getItem('jwtToken') && walletAddress) {
			websocketService.connectToWebSocket();
			getUser(walletAddress);
		}

		return () => {
			// websocketService.deconnectWebsocket();
		};
	}, [loadingWallet, walletAddress]);

	return (
		<Layout
			generalSettings
			isSettingsMobileMenuOpen={isSettingsMobileMenuOpen}
			setIsSettingsMobileMenuOpen={setIsSettingsMobileMenuOpen}
		>
			{onboarding || fetchingUser || loadingWallet ? (
				<div style={{ height: '100vh', width: '100%', display: 'grid', placeItems: 'center', gap: '1rem' }}>
					<div>
						<Spinner color={'var(--primary)'} size={2} />
						<div className="size-18 mt-3 text-primary">Loading data...</div>
					</div>
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
