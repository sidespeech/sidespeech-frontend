import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';

export function setupWeb3Modal() {
	// This is the all of the providers that are needed...
	const providerOptions = {
		walletconnect: {
			package: WalletConnectProvider,
			options: {
				infuraId: 'b49e48dbbec944eea653e7a44ca67500'
			}
		}
	};

	// Setup the web3 modal...
	const web3Modal = new Web3Modal({
		network: 'mainnet', // optional
		cacheProvider: true, // optional
		providerOptions // required
	});

	return web3Modal;
}

export async function verifyNetwork(provider: ethers.providers.Web3Provider) {
	const network = await provider.getNetwork();
	if (network.chainId !== 1) {
		window.ethereum.request({
			method: 'wallet_switchEthereumChain',
			params: [
				{
					chainId: '0x1'
				}
			]
		});
	}
}

export async function getLastProviderIfExist() {
	let cachedProvider = localStorage.getItem('WEB3_CONNECT_CACHED_PROVIDER');
	let res: boolean | { provider: ethers.providers.Web3Provider; signer: ethers.providers.JsonRpcSigner } = false;
	if (cachedProvider) {
		const web3Modal = setupWeb3Modal();
		const provider = await web3Modal.connect();
		const library = new ethers.providers.Web3Provider(provider);
		const signer = library.getSigner();
		res = { provider: library, signer: signer };
	}
	return res;
}
