import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CategoryProposal, Type } from '../../../models/CategoryProposal';
import { Proposal, Status } from '../../../models/Proposal';
import Button from '../../ui-components/Button';
import ProposalComponentList from './Proposals/ProposalComponentList';
import empty from '../../../assets/dao-details-empty-screen.svg';
import { useSelector } from 'react-redux';
import { daoState } from '../../../redux/Slices/InterfaceSelectors';

const proposals: Proposal[] = [
	new Proposal({
		id: '1',
		status: Status.Open,
		details: { endDate: '2023-01-01', nft: { name: 'Bored Ape Yacht Club', token_id: '1234' } },
		category: new CategoryProposal({ id: '12', type: Type.onChain, name: 'Sell NFT' }),
		profileIds: [
			'03640593-6e4f-4cf9-a1d8-675c9cee4eab',
			'03640593-6e4f-4cf9-a1d8-675c9cee4eab',
			'03640593-6e4f-4cf9-a1d8-675c9cee4eab',
			'03640593-6e4f-4cf9-a1d8-675c9cee4eab',
			'03640593-6e4f-4cf9-a1d8-675c9cee4eab'
		]
	}),
	new Proposal({
		id: '12',
		status: Status.Pending,
		details: {
			answers: ['Bored Ape Yacht Club #1347', 'Bored Ape Yacht Club #3685', 'Bored Ape Yacht Club #1284'],
			endDate: '2023-01-25'
		},
		category: new CategoryProposal({ id: '13', type: Type.onChain, name: 'NFT Acquisition' }),
		profileIds: [
			'03640593-6e4f-4cf9-a1d8-675c9cee4eab',
			'03640593-6e4f-4cf9-a1d8-675c9cee4eab',
			'03640593-6e4f-4cf9-a1d8-675c9cee4eab'
		]
	}),
	new Proposal({
		id: '13',
		status: Status.Failed,
		details: { endDate: '2023-01-01' },
		category: new CategoryProposal({ id: '14', type: Type.onChain, name: 'Founding Round' }),
		profileIds: ['03640593-6e4f-4cf9-a1d8-675c9cee4eab']
	}),
	new Proposal({
		id: '14',
		status: Status.NoFund,
		details: { endDate: '2023-01-25', nft: { name: 'Bored Ape Yacht Club', token_id: '1234' } },
		category: new CategoryProposal({ id: '15', type: Type.onChain, name: 'Sell NFT' }),
		profileIds: [
			'03640593-6e4f-4cf9-a1d8-675c9cee4eab',
			'03640593-6e4f-4cf9-a1d8-675c9cee4eab',
			'03640593-6e4f-4cf9-a1d8-675c9cee4eab'
		]
	}),
	new Proposal({
		id: '15',
		status: Status.Closed,
		details: { endDate: '2023-01-25' },
		category: new CategoryProposal({ id: '16', type: Type.onChain, name: 'Sell NFT' }),
		profileIds: ['03640593-6e4f-4cf9-a1d8-675c9cee4eab', '03640593-6e4f-4cf9-a1d8-675c9cee4eab']
	}),
	new Proposal({
		id: '16',
		status: Status.Queue,
		details: { endDate: '2023-01-25' },
		category: new CategoryProposal({ id: '17', type: Type.offChain, name: 'Paris Blochain Event' }),
		profileIds: ['03640593-6e4f-4cf9-a1d8-675c9cee4eab', '03640593-6e4f-4cf9-a1d8-675c9cee4eab']
	}),
	new Proposal({
		id: '17',
		status: Status.Successful,
		details: { endDate: '2023-01-25' },
		category: new CategoryProposal({ id: '18', type: Type.offChain, name: 'Brussels NFT week' }),
		profileIds: [
			'03640593-6e4f-4cf9-a1d8-675c9cee4eab',
			'03640593-6e4f-4cf9-a1d8-675c9cee4eab',
			'03640593-6e4f-4cf9-a1d8-675c9cee4eab'
		]
	})
];

export default function ProposalComponent(props: any) {
	const [activeProposals, setActiveProposals] = useState<Proposal[]>([]);
	const [archivedProposals, setArchivedProposals] = useState<Proposal[]>([]);

	const { selectedProposal } = useSelector(daoState);

	useEffect(() => {
		// TODO use props.proposals instead of hardcoded proposal
		if (proposals.length) {
			const activeProposals = [];
			const archivedProposals = [];
			for (let index = 0; index < proposals.length; index++) {
				const proposal = proposals[index];
				// set an index to the proposal to display the proposal number
				proposal.index = index + 1;
				// grouping proposal by active or inactive
				proposal.isActive() ? activeProposals.push(proposal) : archivedProposals.push(proposal);
			}
			setActiveProposals(activeProposals);
			setArchivedProposals(archivedProposals);
		}
	}, [props.proposals]);

	// TODO proposal creation
	const handleProposalCreation = () => {};

	return (
		<>
			<div className="f-column gap-20 flex-1">
				<div className="flex justify-between align-center">
					<div className="fw-700 size-22 flex justify-between">Proposals </div>
					<Button
						onClick={handleProposalCreation}
						width="174px"
						height={44}
						children={
							<span>
								<span>
									<i className="fa-solid fa-circle-plus mr-2"></i>
								</span>
								Create a proposal
							</span>
						}
					/>
				</div>
				<div className="f-column gap-20  overflow-auto pr-2">
					<div className="size-16 fw-700">Active proposals</div>
					<ProposalComponentList proposals={activeProposals} />
					<div className="size-16 fw-700">Archived proposals</div>
					<ProposalComponentList proposals={archivedProposals} />
				</div>
			</div>
			{/** TODO manage details in a new component ProposalDetail */}
			<div className="flex-1 f-column">
				{selectedProposal ? (
					<div></div>
				) : (
					<div className={'mx-auto my-auto text-inactive text-center'} style={{ maxWidth: 148 }}>
						<img width={148} src={empty} />
						<p>Select a proposal to see the details</p>
					</div>
				)}
			</div>
		</>
	);
}
