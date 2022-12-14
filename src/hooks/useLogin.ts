import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import { useDispatch } from 'react-redux';
import Web3Modal from 'web3modal';
import { connect, fetchUserDatas } from '../redux/Slices/UserDataSlice';
import userService from '../services/api-services/user.service';

export default function useLogin() {
    const dispatch = useDispatch();

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

    const randomNonce = function (length: number) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    const connectWallet = async () => {
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
            let nonce;

            if (!localStorage.getItem('nonce')) {
                nonce = randomNonce(24);
                localStorage.setItem('nonce', nonce);
            } else {
                nonce = localStorage.getItem('nonce');
            }

            // Get Signer
            const signer = library.getSigner();

            const randomNonceString = nonce;

            // Grab the wallet address
            const address = await signer.getAddress();

            // Create the signer message
            const signerMessage =
                'Welcome to SideSpeech! \n \n Click to sign in and accept the SideSpeech Terms of Service: {URL Here} This request will not trigger a blockchain transaction or cost any gas fees.  \n \n Your authentication status will reset after 24 hours.  \n \n  Wallet address: ' +
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

            await userService.findExistingWallet(signature, signerMessage, signerAddr);

            // Send the wallet to the api service.
            const user = await userService.walletConnection(accounts, signerMessage, signature);

            // Dispatch the account that is connected to the redux slice.
            dispatch(connect({ account: accounts[0], user: user }));
            dispatch(fetchUserDatas(accounts[0]));

            // Set a local storage of the account
            localStorage.setItem('userAccount', accounts[0]);

            localStorage.setItem('jwtToken', user.token);
        }

        // Listen for accounts being disconnected - this only seems to work for WalletConnect.
        provider.on('disconnect', handleDisconnect);
    };
    const handleDisconnect = async () => {
        localStorage.removeItem('userAccount');
        localStorage.removeItem('jwtToken');

        // Reload the page to ensure logged out.
        window.location.reload();
    };
    return { connectWallet };
}
