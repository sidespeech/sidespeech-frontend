// Default Imports
import { useLocation, useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';

// Redux Slices
import { fetchUserDatas, connect, setSigner, setProvider } from '../../redux/Slices/UserDataSlice';

// Redux
import { useDispatch, useSelector } from 'react-redux';

// Images
import logoSmall from '../../assets/logo.svg';
import walletIcon from '../../assets/wallet-icon.svg';

// Web3 Imports
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

// Stylings
import styled from 'styled-components';
import Button from '../ui-components/Button';
import userService from '../../services/api-services/user.service';
import { RootState } from '../../redux/store/app.store';
import { useEffect } from 'react';
import { disconnect } from 'process';
import { setupWeb3Modal } from '../../helpers/utilities.web3';

export const SeparatorVertical = styled.div`
	min-height: 415px;
	border-right: 1px solid var(--disable);
	margin: 0px 42px;
`;

const LoginStyled = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	align-items: center;
	justify-content: center;
	gap: 2rem;
	& .app-name {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		& h1 {
			margin: 0;
		}
	}
	& .connection-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		& h2 {
			margin: 0;
		}
		& .connect-btn {
			color: var(--background);
			svg {
				margin-right: 0.5rem;
			}
		}
	}
`;

export default function Login() {
	// Setup constants for dispatch, navigate and selector methods
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const userData = useSelector((state: RootState) => state.user);

	useEffect(() => {
		if (userData.account)
			navigate(location.state?.redirectFrom || '/', {
				state: {
					redirectFrom: location.pathname
				}
			});
	}, [userData]);

	function ConnectWalletArea() {

		// Setup the web3 modal...
		const web3Modal = setupWeb3Modal()

		const randomNonce = function (length: number) {
			var text = '';
			var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			for (var i = 0; i < length; i++) {
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			}
			return text;
		};

		// Method for wallet connection...
		const connectWallet = async () => {
			try {
				// Open the connector
				const provider = await web3Modal.connect();
				// Set the provider.
				const library = new ethers.providers.Web3Provider(provider);

				// Grab the accounts.
				const accounts = await library.listAccounts();

				let signerAddr = '';
				let signature = '';

				// If there are any accounts connected then send them to the API.
				if (accounts) {
					// Get Signer
					const signer = library.getSigner();

					const randomNonceString = randomNonce(12);

					// Grab the wallet address
					const address = await signer.getAddress();

					// Create the signer message
					const signerMessage =
						'Welcome to SideSpeech! \n \n Click to sign in and accept the SideSpeech Terms of Service: https://side.xyz/general-settings/terms This request will not trigger a blockchain transaction or cost any gas fees.  \n \n Your authentication status will reset after 24 hours.  \n \n  Wallet address: ' +
						address +
						'  \n \n  Nonce: ' +
						randomNonceString;

					// Create the signature signing message.
					signature = await signer.signMessage(signerMessage);

					// Get the signer address.
					signerAddr = ethers.utils.verifyMessage(signerMessage, signature);

					// Check if the signer address is the same as the connected address.
					if (signerAddr !== address) {
						return false;
					}

					// Attempt to find an existing user by passing their address and the signature that they signed.
					const existingUser = await userService.findExistingWallet(accounts[0], signerMessage, signature);

					// Send the wallet to the api service.
					const user = await userService.walletConnection(accounts[0], signerMessage, signature);

					// Check if the existing user still needs to onboard or not.
					if (existingUser == null) {
						// Redirect the user to the onboarding area.
						navigate('/onboarding', {
							state: {
								redirectFrom: location.pathname
							}
						});
					} else {
						// Redirect the user to the general settings page.
						navigate(location.state?.redirectFrom || '/', {
							state: {
								redirectFrom: location.pathname
							}
						});
					}

					// Dispatch the account that is connected to the redux slice.
					dispatch(connect({ account: accounts[0], user: user }));
					dispatch(fetchUserDatas(accounts[0]));
					dispatch(setSigner(signer))
					dispatch(setProvider(library))

					// Set a local storage of the account
					localStorage.setItem('userAccount', accounts[0]);
					localStorage.setItem('jwtToken', user.token);

					// Listen for accounts being disconnected - this only seems to work for WalletConnect.
					provider.on('disconnect', handleDisconnect);
				}
			} catch (err: any) {
				console.log('error', err, ' message', err.message);
				if (
					typeof err !== 'undefined' &&
					typeof err.message !== 'undefined' &&
					err.message.includes('user rejected')
				) {
					toast.error('You rejected the request', {
						toastId: 6
					});
				} else if ((typeof err === 'string' || err instanceof String) && err.includes('Modal closed by user')) {
					toast.error('You closed the modal', {
						toastId: 6
					});
				} else {
					toast.error('Something went wrong.', {
						toastId: 6
					});
				}
			}
		};

		// Method for handling the disconnection.
		const handleDisconnect = async () => {
			// Clear all the local storage.
			dispatch(disconnect());
		};

		return (
			<div className="connection-container">
				<h2>Connect your wallet and choose your side</h2>
				<Button classes="connect-btn" onClick={() => connectWallet()}>
					<svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M13.5 10.5C13.9333 10.5 14.2917 10.3583 14.575 10.075C14.8583 9.79167 15 9.43333 15 9C15 8.56667 14.8583 8.20833 14.575 7.925C14.2917 7.64167 13.9333 7.5 13.5 7.5C13.0667 7.5 12.7083 7.64167 12.425 7.925C12.1417 8.20833 12 8.56667 12 9C12 9.43333 12.1417 9.79167 12.425 10.075C12.7083 10.3583 13.0667 10.5 13.5 10.5ZM2.5 18C1.95 18 1.479 17.8043 1.087 17.413C0.695667 17.021 0.5 16.55 0.5 16V2C0.5 1.45 0.695667 0.979 1.087 0.587C1.479 0.195667 1.95 0 2.5 0H16.5C17.05 0 17.521 0.195667 17.913 0.587C18.3043 0.979 18.5 1.45 18.5 2V4.5H16.5V2H2.5V16H16.5V13.5H18.5V16C18.5 16.55 18.3043 17.021 17.913 17.413C17.521 17.8043 17.05 18 16.5 18H2.5ZM10.5 14C9.95 14 9.47933 13.8043 9.088 13.413C8.696 13.021 8.5 12.55 8.5 12V6C8.5 5.45 8.696 4.979 9.088 4.587C9.47933 4.19567 9.95 4 10.5 4H17.5C18.05 4 18.521 4.19567 18.913 4.587C19.3043 4.979 19.5 5.45 19.5 6V12C19.5 12.55 19.3043 13.021 18.913 13.413C18.521 13.8043 18.05 14 17.5 14H10.5ZM17.5 12V6H10.5V12H17.5Z"
							fill="var(--background)"
						/>
					</svg>
					Connect wallet
				</Button>
			</div>
		);
	}

	return (
		<LoginStyled>
			<div className="app-name">
				<svg width="79" height="77" viewBox="0 0 79 77" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						d="M45.0267 30.9182L35.9696 30.8997C31.7922 30.8997 28.3912 27.5013 28.3912 23.3272V22.7731C28.3912 18.5989 31.7922 15.2005 35.9696 15.2005H79C75.3402 9.05013 70.4604 3.84169 64.4347 0H35.9511C23.3821 0 13.179 10.2137 13.179 22.7546V23.3087C13.179 25.9683 13.6411 28.5172 14.4913 30.8997C17.6336 39.7282 26.0622 46.0818 35.9696 46.0818L45.0267 46.1003C49.204 46.1003 52.6051 49.4987 52.6051 53.6728V54.2269C52.6051 58.4011 49.204 61.7995 45.0267 61.7995H0C3.6598 67.9499 8.59499 73.1583 14.6207 77H45.0082C57.5772 77 67.7803 66.7863 67.7803 54.2454V53.6913C67.7803 51.0317 67.3182 48.4829 66.4679 46.1003C63.3627 37.2718 54.9155 30.9182 45.0267 30.9182Z"
						fill="var(--primary)"
					/>
				</svg>
				<h1>SideSpeech</h1>
			</div>
			<ConnectWalletArea />
		</LoginStyled>
	);
}
