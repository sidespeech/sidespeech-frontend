import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Type } from '../../../../models/CategoryProposal';
import { Proposal, Status } from '../../../../models/Proposal';
import { setSelectedProposal } from '../../../../redux/Slices/DaoSlice';
import { daoState } from '../../../../redux/Slices/InterfaceSelectors';
import Button from '../../../ui-components/Button';
import { Chip } from '../../../ui-components/styled-components/shared-styled-components';

interface IProposalComponentItem {
	proposal: Proposal;
}

const ChipContent = styled.div<any>`
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	gap: 6px;
	line-height: 14px;
`;
const ProposalContainer = styled.div<any>`
	border: 1px solid var(--white-transparency-10);
	background-color: ${props => props.selectedProposal && ' var(--white-transparency-10)'};
	border-radius: 7px;
	min-height: 98px;
	padding: 16px 30px 16px 0px;
	display: flex;
	align-items: center;
	cursor: pointer;
	transition: background-color 0.3s;

	& .proposal-content {
		border-left: 2px solid var(--${props => props.borderLeftColor});
		display: flex;
		gap: 10px;
		align-items: center;
		padding-left: 14px;
		justify-content: space-between;
		width: 100%;
	}
	& .proposal-content > div {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	&:hover {
		background-color: var(--white-transparency-10);
	}
`;

export default function ProposalComponentItem({ proposal }: IProposalComponentItem) {
	const dispatch = useDispatch();

	const { selectedProposal } = useSelector(daoState);

	const renderActionButton = () => {
		switch (proposal.status) {
			case Status.Open:
				return <Button background="var(--white-transparency-10)" width="60px" height={43} children={'Vote'} />;
			case Status.Pending:
			case Status.Queue:
				return <Button width="86px" height={43} children={'Approve'} />;
			case Status.Closed:
			case Status.Failed:
			case Status.NoFund:
			case Status.Successful:
				return <div className="fw-700">Voted</div>;
			default:
				break;
		}
	};

	const getBackgroundColor = () => {
		return proposal.category?.type === Type.onChain ? 'var(--green-opacity)' : 'var(--yellow-opacity)';
	};
	const getTextColor = () => {
		return proposal.category?.type === Type.onChain ? 'text-green' : 'text-yellow';
	};

	const getColor = () => {
		switch (proposal.status) {
			case Status.Open:
			case Status.Pending:
			case Status.Queue:
				return 'yellow';
			case Status.Failed:
			case Status.NoFund:
				return 'red';
			case Status.Closed:
			case Status.Successful:
				return 'green';
			default:
				break;
		}
	};

	const getTextStatus = () => {
		switch (proposal.status) {
			case Status.Open:
				return `In progress - End on ${proposal.details.endDate}`;
			case Status.Pending:
			// TODO Display number of need approval using proposal attributes
			case Status.Queue:
				return `Waiting for approval (3/4)`;
			case Status.Failed:
			case Status.NoFund:
				return `Not passed the ${proposal.details.endDate}`;
			case Status.Closed:
			case Status.Successful:
				return `Completed the ${proposal.details.endDate}`;
			default:
				break;
		}
	};

	const getTitle = () => {
		const details = proposal.details;
		return details.nft
			? `- ${details.nft.name} #${details.nft.token_id}`
			: details.answers
			? ` - ${details.answers.length} choices`
			: `${details.title || ''}`;
	};

	const renderIcon = () => {
		switch (proposal.status) {
			case Status.Open:
				return <i className={`icon-event_available-1 mr-1`}></i>;
			case Status.Pending:
			case Status.Queue:
				return <i className={`icon-history_edu mr-1`}></i>;
			case Status.Failed:
			case Status.NoFund:
				return <i className={`icon-event_busy mr-1`}></i>;
			case Status.Closed:
			case Status.Successful:
				return <i className={`icon-event_available-1 mr-1`}></i>;
			default:
				break;
		}
	};

	const handleSelectedProposal = () => {
		dispatch(setSelectedProposal(proposal));
	};

	return (
		<ProposalContainer
			borderLeftColor={getColor()}
			selectedProposal={selectedProposal?.id === proposal.id}
			onClick={handleSelectedProposal}
		>
			<div className="proposal-content">
				<div>
					<div className="flex align-center gap-10">
						<Chip
							padding={'3px 6px'}
							fontSize="10px"
							fontWeight={700}
							borderRadius="5px"
							backgroundColor={getBackgroundColor()}
							height={20}
						>
							<ChipContent>
								<span>#{proposal.index}</span>
								<span className={`${getTextColor()} text-uppercase`}>
									{Type[proposal.category!.type]}
								</span>
							</ChipContent>
						</Chip>
						<span className="fw-700 text-light">
							{proposal.category?.name}
							{getTitle()}
						</span>
					</div>

					<div className="text-light-30">{proposal.profileIds?.length} participants</div>
					<div className={`text-${getColor()}`}>
						{renderIcon()}
						{getTextStatus()}
					</div>
				</div>
				{renderActionButton()}
			</div>
		</ProposalContainer>
	);
}
