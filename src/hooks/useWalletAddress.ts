import React, { useCallback, useEffect, useState } from 'react';
import { connectedWallet } from '../helpers/utilities';

const useWalletAddress = () => {
	const [loadingWallet, setLoadingWallet] = useState<boolean>(true);
	const [walletAddress, setWalletAddress] = useState<string | null>(null);

	const getWalletAddress = useCallback(async () => {
		try {
			setLoadingWallet(true);
			const address = await connectedWallet();
			setWalletAddress(address);
		} catch (error) {
			console.error(error);
		} finally {
			setLoadingWallet(false);
		}
	}, []);

	useEffect(() => {
		getWalletAddress();
	}, [getWalletAddress]);

	return {
		loadingWallet,
		getWalletAddress,
		walletAddress
	};
};

export default useWalletAddress;
