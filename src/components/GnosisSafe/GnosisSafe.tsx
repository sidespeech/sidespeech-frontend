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
import categoryProposalService from '../../services/api-services/category-proposal.service';
import proposalService from '../../services/api-services/proposal.service';
import { Proposal, Status } from '../../models/Proposal';

import moment from 'moment'


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

    async function ethersProvider() {
        // This is the all of the providers that are needed...
        // See the thing is that 
        // prolble is the nft doens't gets transferred to your address
        // assumpation is that maybe due to the worng network 
        // txn -> georli network 
        const providerOptions = {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    infuraId: 'c0db0b85222f4f5c82dd2bed1fc843f9' // b49e48dbbec944eea653e7a44ca67500
                }
            }
        };

        // Setup the web3 modal...
        const web3Modal = new Web3Modal({
            network: 'goerli', // optional
            cacheProvider: false, // optional
            providerOptions // required
        });

        // Open the connector
        const provider = await web3Modal.connect();

        // Set the provider.
        const library = new ethers.providers.Web3Provider(provider);
        return library
    }

    async function getSigner(library: ethers.providers.Web3Provider) {

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
            return signer
        }
    }

    async function createSafe() {
        const provider = await ethersProvider();
        const signer = await getSigner(provider);
        if (signer)
            await safeService.createSafe(signer, '0xafEE34F5064539b53E5B7102f8B3BB2951b3591A', "55a57b3c-a207-4e76-befa-513274d3e2b8", "ec0d6ee8-482a-4fd7-8793-033684a3d76b")

    }


    async function linkSafeToProfile(user: any) {
        const profile = await profileService.linkSafeProfile({
            safeId: "945abc4d-0016-45eb-b560-103f4e15b87f",
            profileId: 'ec0d6ee8-482a-4fd7-8793-033684a3d76b',
            sideId: user!['profiles'][0]['side']['id'],
            safeRole: safeRole.unsigned
        });
        console.log("profile :", profile);
    }


    async function getAllCategoriesAndCreateProposal() {
        const categories = await categoryProposalService.getAllCategories();
        let example = categories.find((item: any) => item['name'] === "Open funding round");
        const proposal = await createProposal({
            categoryId: example['id'],
            safeId: "2ea3f5d9-81c2-48d0-9d50-36aedd84e4a6",
            status: Status.Open,
            details: {
                currency: 'ETH',
                start_date: moment(Date.now()).format('DD-MM-YYYY HH:mm:ss'),
                end_date: moment(Date.now()).add(1, 'days').format('DD-MM-YYYY HH:mm:ss'),
                description: 'This founding round is to create nft event',
            }
        })
        console.log('proposal :', proposal);
    }


    async function createProposal(data: Proposal) {
        const proposal = await proposalService.saveProposal(data);
        return proposal
    }


    async function connectToSafe() {
        const safeAddress = "0x4924F203F0B9a4A9a24F2fb4F741c0EEbDd44b80"
        const provider = await ethersProvider();
        const signer = await getSigner(provider);

        const nftAddress = "0x9e339352232149ce1957af39596445ce9d4f59a6"

        const to_address = '0xafEE34F5064539b53E5B7102f8B3BB2951b3591A';
        const value_to_transfers = '0.01'
        if (signer) {
            const safeSdk = await safeService.connectToExistingSafe(signer, safeAddress);
            // await safeService.createSafeTransaction(safeSdk, signer, to_address, value_to_transfers, provider)
            // await safeService.createRegularTransaction(signer, safeAddress, value_to_transfers, provider);
            // await safeService.buySafeNft(safeSdk, signer, nftAddress)
        }

        // if (provider && signer) {
        //     const safeSdk = await safeService.connectToExistingSafe(signer, safeAddress);
        //     await safeService.payOutMembers(safeSdk, provider)
        // }

    }

    useEffect(() => {
        if (user) {

            console.log('user :', user)

            // createSafe()
            getAllCategoriesAndCreateProposal();
            // connectToSafe()
        }
    }, [user]);

    return (
        <div>

        </div>
    );
}
