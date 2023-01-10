import Safe from '@safe-global/safe-core-sdk';
import { ethers } from 'ethers';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { proposalStatus } from '../helpers/utilities';
import { verifyNetwork } from '../helpers/utilities.web3';
import { safeRole } from '../models/Profile';
import { Proposal, Status } from '../models/Proposal';
import { RootState } from '../redux/store/app.store';
import categoryProposalService from '../services/api-services/category-proposal.service';
import profileService from '../services/api-services/profile.service';
import proposalService from '../services/api-services/proposal.service';
import safeService from '../services/api-services/safe.service';
import transactionService from '../services/api-services/transaction.service';

export function useGnosisSafe() {
	const { user, signer, provider } = useSelector((state: RootState) => state.user);
	const { currentSide } = useSelector((state: RootState) => state.appDatas);
	const [currentSafe, setCurrentSafe] = useState<Safe>();

	async function createSafe(
		signer: ethers.providers.JsonRpcSigner,
		ownerAddress: string,
		sideId: string,
		profileId: string
	) {
		await safeService.createSafe(signer, ownerAddress, sideId, profileId, () =>
			toast.success('Your safe wallet has been deployed successfuly.')
		);
	}

	async function linkSafeToProfile(user: any) {
		const profile = await profileService.linkSafeProfile({
			safeId: '945abc4d-0016-45eb-b560-103f4e15b87f',
			profileId: 'ec0d6ee8-482a-4fd7-8793-033684a3d76b',
			sideId: user!['profiles'][0]['side']['id'],
			safeRole: safeRole.unsigned
		});
		console.log('profile :', profile);
	}

	async function getAllCategoriesAndCreateProposal() {
		const safeId = '2ea3f5d9-81c2-48d0-9d50-36aedd84e4a6';
		const categories = await categoryProposalService.getAllCategories();
		const currentsProposals = await proposalService.getProposalsBySafeId(safeId);
		let categ = categories.find((item: any) => item['name'] === 'Open funding round');

		const proposal = await createProposal(
			new Proposal({
				categoryId: categ['id'],
				safeId: safeId,
				status: currentsProposals.length ? Status.Queue : proposalStatus(categ),
				details: {
					currency: 'ETH',
					start_date: moment(Date.now()).format('DD-MM-YYYY HH:mm:ss'),
					end_date: moment(Date.now()).add(1, 'days').format('DD-MM-YYYY HH:mm:ss'),
					description: 'This founding round is to create nft event'
				}
			})
		);
		console.log('proposal :', proposal);
	}

	async function createProposal(data: Proposal) {
		const proposal = await proposalService.saveProposal(data);
		return proposal;
	}

	async function getActiveProposalBySafeId(safeId: string) {
		return await proposalService.getActiveProposalsBySafeId(safeId);
	}

	async function sendTokenToFundingRound() {
		if (!currentSafe) return;
		const safeId = '2ea3f5d9-81c2-48d0-9d50-36aedd84e4a6';
		const activeProposal = await getActiveProposalBySafeId(safeId);
		console.log('activeProposal :', activeProposal);
		const value_to_transfers = '0.01';

		let transactionFormated = await safeService.createRegularTransaction(
			signer!,
			currentSafe.getAddress(),
			value_to_transfers,
			provider!
		);
		transactionFormated['proposalId'] = activeProposal['id'];
		const transaction = await transactionService.saveTransaction(transactionFormated);
		console.log('transaction :', transaction);
	}

	async function connectToSafe(
		signer: ethers.providers.JsonRpcSigner,
		safeAddress: string,
		provider: ethers.providers.Web3Provider
	) {
		// const nftAddress = '0x9e339352232149ce1957af39596445ce9d4f59a6';

		// const to_address = '0xafEE34F5064539b53E5B7102f8B3BB2951b3591A';
		// const value_to_transfers = '0.01';
		let safeSdk: Safe | null = null;
		if (signer) {
			try {
				// FIXME this only ask to the user to change network but the error still occurs.
				// we need to handle the network change in case of wrong network and connect to the safe after the change.
				await verifyNetwork(provider);
				safeSdk = await safeService.connectToExistingSafe(signer, safeAddress);
			} catch (error) {
				toast.error('Problem when connecting to your safe. Verify your network.');
				console.log(error);
			}
			// await safeService.createSafeTransaction(safeSdk, signer, to_address, value_to_transfers, provider)
			// await safeService.createRegularTransaction(signer, safeAddress, value_to_transfers, provider);
			// await safeService.buySafeNft(safeSdk, signer, nftAddress)
		}

		// if (provider && signer) {
		//     const safeSdk = await safeService.connectToExistingSafe(signer, safeAddress);
		//     await safeService.payOutMembers(safeSdk, provider)
		// }

		return safeSdk;
	}

	async function process(
		signer: ethers.providers.JsonRpcSigner,
		safeAddress: string,
		provider: ethers.providers.Web3Provider
	) {
		const safeSdk = await connectToSafe(signer, safeAddress, provider);
		if (safeSdk) setCurrentSafe(safeSdk);
	}

	useEffect(() => {
		console.log('user :', user);
		console.log('signer :', signer);
		console.log('provider :', provider);

		if (user && signer && provider && !currentSafe && currentSide && currentSide.isDaoActive) {
			// createSafe()
			// getAllCategoriesAndCreateProposal();
			process(signer, currentSide.safes[0].contractAddress, provider);
		}
	}, [user, signer, provider, currentSafe, currentSide]);

	return {
		createSafe,
		currentSafe,
		sendTokenToFundingRound
	};
}
