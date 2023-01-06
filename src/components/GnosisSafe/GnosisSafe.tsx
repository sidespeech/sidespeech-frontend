import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/store/app.store';

import Safe, { SafeFactory, SafeAccountConfig, ContractNetworksConfig } from '@safe-global/safe-core-sdk';
import { ethers } from 'ethers';
import EthersAdapter from '@safe-global/safe-ethers-lib';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import safeService from '../../services/api-services/safe.service';
import profileService from '../../services/api-services/profile.service';
import { safeRole } from '../../models/Profile';
import categoryProposalService from '../../services/api-services/category-proposal.service';
import proposalService from '../../services/api-services/proposal.service';
import { Proposal, Status } from '../../models/Proposal';

import moment from 'moment';
import { proposalStatus } from '../../helpers/utilities';
import Button from '../ui-components/Button';
import styled from 'styled-components';
import { breakpoints, size } from '../../helpers/breakpoints';
import transactionService from '../../services/api-services/transaction.service';
import { useGnosisSafe } from '../../hooks/useGnosisSafe';
import { appDataState } from '../../redux/Slices/InterfaceSelectors';
import { setSelectedDao } from '../../redux/Slices/AppDatasSlice';
import SafeDashboard from './GnosisSafeContent/SafeDashboard';
import Nfts from './GnosisSafeContent/Nfts';
import ProposalComponent from './GnosisSafeContent/ProposalComponent';
import FundingRounds from './GnosisSafeContent/FundingRounds';
import Members from './GnosisSafeContent/Members';
import Transactions from './GnosisSafeContent/Transactions';

const MenuItem = styled.div<any>`
	display: flex;
	align-items: flex-start;
	padding: 8px 18px;
	cursor: pointer;
	background-color: ${props => (props.selected ? 'var(--green)' : 'var(--white-transparency-10)')};
	color: ${props => (props.selected ? 'black' : 'var(--white)')};
	border-radius: 7px;
	white-space: nowrap;
`;

const menu = ['Dashboard', 'NFTs', 'Proposals', 'Funding rounds', 'Members', 'Transactions'];

export default function GnosisSafe() {
	const { currentSafe, sendTokenToFundingRound } = useGnosisSafe();
	const { displayDao, currentSide } = useSelector(appDataState);
	const [selectedItem, setSelectedItem] = useState<number>(1);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (currentSide && !currentSide.isDaoActive) navigate('/side' + currentSide.slug);
		if (!displayDao) dispatch(setSelectedDao(true));
	}, [displayDao, currentSide]);

	const handleSelectedMenu = (index: number) => {
		setSelectedItem(index);
	};

	const renderGnosisContent = () => {
		let content;
		switch (selectedItem) {
			case 0:
				content = <SafeDashboard />;
				break;
			case 1:
				content = <Nfts />;
				break;
			case 2:
				content = <ProposalComponent />;
				break;
			case 3:
				content = <FundingRounds />;
				break;
			case 4:
				content = <Members />;
				break;
			case 5:
				content = <Transactions />;
				break;
			default:
				content = <SafeDashboard />;
				break;
		}
		return content;
	};

	return (
		<div className="px-4 ">
			<div className="flex fw-700 gap-15 mb-4">
				{menu.map((item, index) => (
					<MenuItem selected={index === selectedItem} onClick={() => handleSelectedMenu(index)} key={item}>
						{item}
					</MenuItem>
				))}
			</div>
			<div>{renderGnosisContent()}</div>
		</div>
	);
}
