import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CategoryProposal, Type } from '../../../models/CategoryProposal';
import { Proposal, Status } from '../../../models/Proposal';
import Button from '../../ui-components/Button';
import ProposalComponentList from './Proposals/ProposalComponentList';
import empty from '../../../assets/dao-details-empty-screen.svg';
import { useSelector } from 'react-redux';
import { daoState } from '../../../redux/Slices/InterfaceSelectors';
import ProposalDetails from './Proposals/ProposalDetails';

const proposals: Proposal[] = [
	new Proposal({
		id: '1',
		status: Status.Open,
		endDate: '2023-01-01',
		creationDate: '2022-01-01',
		details: { nft: { name: 'Bored Ape Yacht Club', token_id: '1234' }, descripiton: 'Seeling NFT BAYC #1234' },
		creatorAddress: '0x4802757eE8E8085D1E6507f983C5d3EBc270f5c7',
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
		endDate: '2023-01-25',
		creationDate: '2022-01-01',
		details: {
			answers: [
				{
					id: '1',
					optionId: '1',
					text: 'Bored Ape Yacht Club #1347',
					votes: 1,
					nft: 'https://api.phantom.app/image-proxy/?image=https%3A%2F%2Farweave.net%2FMRosxcfIWBX5EI088UMXvaQw7OhOYqZULHAWIpvYVdE%2F3326.png'
				},
				{
					id: '2',
					optionId: '2',
					text: 'Bored Ape Yacht Club #3685',
					votes: 2,
					nft: 'https://api.phantom.app/image-proxy/?image=https%3A%2F%2Farweave.net%2FMRosxcfIWBX5EI088UMXvaQw7OhOYqZULHAWIpvYVdE%2F3326.png'
				},
				{
					id: '3',
					optionId: '3',
					text: 'Bored Ape Yacht Club #1284',
					votes: 7,
					nft: 'https://api.phantom.app/image-proxy/?image=https%3A%2F%2Farweave.net%2FMRosxcfIWBX5EI088UMXvaQw7OhOYqZULHAWIpvYVdE%2F3326.png'
				},
				{
					id: '4',
					optionId: '5',
					text: 'No thanks,',
					votes: 3,
					nft: '/forbidden-sign.svg'
				}
			],
		},
		creatorAddress: '0x4802757eE8E8085D1E6507f983C5d3EBc270f5c7',
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
		endDate: '2023-01-01',
		creationDate: '2022-01-01',
		details: { description: 'New funding round to buy an NFT and to add cash the the pool.' },
		creatorAddress: '0x4802757eE8E8085D1E6507f983C5d3EBc270f5c7',
		category: new CategoryProposal({ id: '14', type: Type.onChain, name: 'Founding Round' }),
		profileIds: ['03640593-6e4f-4cf9-a1d8-675c9cee4eab']
	}),
	new Proposal({
		id: '14',
		status: Status.NoFund,
		endDate: '2023-01-25',
		creationDate: '2022-01-01',
		details: { nft: { name: 'Bored Ape Yacht Club', token_id: '1234' }, descripiton: 'Seeling NFT BAYC #1234' },
		creatorAddress: '0x4802757eE8E8085D1E6507f983C5d3EBc270f5c7',
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
		creationDate: '2022-01-01',
		endDate: '2023-01-25',
		details: { nft: { name: 'Bored Ape Yacht Club', token_id: '1234' }, descripiton: 'Seeling NFT BAYC #1234' },
		creatorAddress: '0x4802757eE8E8085D1E6507f983C5d3EBc270f5c7',
		category: new CategoryProposal({ id: '16', type: Type.onChain, name: 'Sell NFT' }),
		profileIds: ['03640593-6e4f-4cf9-a1d8-675c9cee4eab', '03640593-6e4f-4cf9-a1d8-675c9cee4eab']
	}),
	new Proposal({
		id: '16',
		status: Status.Queue,
		creationDate: '2022-01-01',
		endDate: '2023-01-25',
		details: {},
		creatorAddress: '0x4802757eE8E8085D1E6507f983C5d3EBc270f5c7',
		category: new CategoryProposal({ id: '17', type: Type.offChain, name: 'Paris Blochain Event' }),
		profileIds: ['03640593-6e4f-4cf9-a1d8-675c9cee4eab', '03640593-6e4f-4cf9-a1d8-675c9cee4eab']
	}),
	new Proposal({
		id: '17',
		status: Status.Successful,
		creationDate: '2022-01-01',
		details: {},
		endDate: '2023-01-25',
		creatorAddress: '0x4802757eE8E8085D1E6507f983C5d3EBc270f5c7',
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
			<div className="f-column gap-20 flex-1 text-light">
				<div className="flex justify-between align-center pr-3">
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
					<ProposalDetails selectedProposal={selectedProposal} />
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
