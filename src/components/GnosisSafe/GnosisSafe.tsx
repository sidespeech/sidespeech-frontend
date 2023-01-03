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
import { proposalStatus } from '../../helpers/utilities';
import Button from '../ui-components/Button';
import styled from 'styled-components';
import { breakpoints, size } from '../../helpers/breakpoints';
import transactionService from '../../services/api-services/transaction.service';


const SafeStyled = styled.div`
display: flex;
flex-direction: column;
overflow-y: scroll;
width: 100%;
flex-grow: 1;
min-height: 100vh;
padding: 0 0 77px 0;
${breakpoints(
    size.lg,
    `
{
  padding: 5rem;
}
`
)}
& > div {
    flex-shrink: 1;
    width: 100%;
    flex-direction: column;
    ${breakpoints(
        size.lg,
        `{
  flex-direction: row;
}`
    )};
    & .current-tab-wrapper {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        padding: 1rem;
        ${breakpoints(
            size.lg,
            `{
    padding: 0 1rem;
  }`
        )}
    }
}
`;


export default function GnosisSafe() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { userCollectionsData, user, signer, provider } = useSelector((state: RootState) => state.user);
    const [currentSafe, setCurrentSafe] = useState<Safe>();


    async function createSafe() {
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
        const safeId = "2ea3f5d9-81c2-48d0-9d50-36aedd84e4a6"
        const categories = await categoryProposalService.getAllCategories();
        const currentsProposals = await proposalService.getProposalsBySafeId(safeId);
        let categ = categories.find((item: any) => item['name'] === "Open funding round");

        const proposal = await createProposal({
            categoryId: categ['id'],
            safeId: safeId,
            status: (currentsProposals.length) ? Status.Queue : proposalStatus(categ),
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


    async function getActiveProposalBySafeId(safeId: string) {
        return await proposalService.getActiveProposalsBySafeId(safeId);
    }

    async function sendTokenToFundingRound(safeSdk: Safe) {
        const safeId = "2ea3f5d9-81c2-48d0-9d50-36aedd84e4a6"
        const activeProposal = await getActiveProposalBySafeId(safeId);
        console.log('activeProposal :', activeProposal);
        const value_to_transfers = '0.01'

        let transactionFormated = await safeService.createRegularTransaction(signer!, safeSdk.getAddress(), value_to_transfers, provider!);
        transactionFormated['proposalId'] = activeProposal['id'];
        const transaction = await transactionService.saveTransaction(transactionFormated);
        console.log('transaction :', transaction);
    }


    async function connectToSafe(signer: ethers.providers.JsonRpcSigner) {
        const safeAddress = "0x4924F203F0B9a4A9a24F2fb4F741c0EEbDd44b80"

        const nftAddress = "0x9e339352232149ce1957af39596445ce9d4f59a6"

        const to_address = '0xafEE34F5064539b53E5B7102f8B3BB2951b3591A';
        const value_to_transfers = '0.01'
        let safeSdk: Safe | null = null;
        if (signer) {
            safeSdk = await safeService.connectToExistingSafe(signer, safeAddress);
            // await safeService.createSafeTransaction(safeSdk, signer, to_address, value_to_transfers, provider)
            // await safeService.createRegularTransaction(signer, safeAddress, value_to_transfers, provider);
            // await safeService.buySafeNft(safeSdk, signer, nftAddress)
        }

        // if (provider && signer) {
        //     const safeSdk = await safeService.connectToExistingSafe(signer, safeAddress);
        //     await safeService.payOutMembers(safeSdk, provider)
        // }

        return safeSdk

    }

    async function process(signer: ethers.providers.JsonRpcSigner, provider: ethers.providers.Web3Provider) {
        const safeSdk = await connectToSafe(signer);
        if (safeSdk) setCurrentSafe(safeSdk);
    }

    useEffect(() => {

        console.log('user :', user)
        console.log('signer :', signer)
        console.log('provider :', provider)

        if (user && signer && provider) {

            // createSafe()
            // getAllCategoriesAndCreateProposal();
            process(signer, provider);
        }
    }, [user, signer, provider]);

    return (
        <SafeStyled> {

            (currentSafe) ?
                <div className="flex align-start w-100">
                    <Button
                        classes="size-12"
                        width={'150px'}
                        height={50}
                        radius={5}
                        onClick={() => sendTokenToFundingRound(currentSafe)}
                        background={'var(--white-transparency-10)'}
                    >Send Token To Funding Round</Button>
                </div> : null
        }
        </SafeStyled>
    );
}
