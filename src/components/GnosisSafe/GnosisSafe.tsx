import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store/app.store';

import Safe, { SafeFactory, SafeAccountConfig, ContractNetworksConfig } from '@safe-global/safe-core-sdk';
import { ethers } from 'ethers';
import EthersAdapter from '@safe-global/safe-ethers-lib'
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import safeService from '../../services/api-services/safe.service';
import profileService from '../../services/api-services/profile.service';
import { safeRole } from '../../models/Profile';


const randomNonce = function (length: number) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

export default function GnosisSafe() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userCollectionsData, user } = useSelector((state: RootState) => state.user);

    async function createSafe(ethAdapter: EthersAdapter) {
        const safeFactory = await SafeFactory.create({ ethAdapter })

        console.log('safeFactory :', safeFactory);

        const owners = ['0xafEE34F5064539b53E5B7102f8B3BB2951b3591A']
        const threshold = 1
        const safeAccountConfig: SafeAccountConfig = {
            owners,
            threshold,
        }

        console.log('safeAccountConfig :', safeAccountConfig);


        const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig })

        console.log('safeSdk :', safeSdk);

        const newSafeAddress = safeSdk.getAddress();
        console.log('newSafeAddress :', newSafeAddress)

        await safeService.savednewSafe({
            contractAddress : newSafeAddress,
            threshold: threshold,
            sideId : user!['profiles'][0]['side']['id'],
            profileId : user!['profiles'][0]['id']
        });
    }

    async function getSigner() {
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
            cacheProvider: false, // optional
            providerOptions // required
        });

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

            console.log('signature :', signature)

            const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer });
            console.log("ethAdapter :", ethAdapter)

            createSafe(ethAdapter)
        }
    }


    async function test(user:any) {
        await profileService.linkSafeProfile({
            safeId : 'a1c2029e-0487-4e08-80ba-004c56d6c2f3',
            profileId: 'ec0d6ee8-482a-4fd7-8793-033684a3d76b',
            sideId : user!['profiles'][0]['side']['id'],
            safeRole: safeRole.unsigned
        });
    }
    useEffect(() => {
        if (user) {

            console.log('user :', user)
            console.log('user :', user['profiles'][0]['id'])
            // test(user)



            // getSigner()
        }
    }, [user]);

    return (
        <div>

        </div>
    );
}
