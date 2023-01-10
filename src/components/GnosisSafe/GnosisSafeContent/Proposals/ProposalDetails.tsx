import React, { useState } from 'react';
import moment from 'moment';
import { useGetUserPartialInfo } from '../../../../hooks/useGetUserPartialInfo';
import { Proposal } from '../../../../models/Proposal';
import UserBadge from '../../../ui-components/UserBadge';
import Votes from '../../../ui-components/Votes';
import Button from '../../../ui-components/Button';
import { Chip } from '../../../ui-components/styled-components/shared-styled-components';
import ProposalResume from './ProposalDetails/ProposalResume';
import ProposalMembers from '../ProposalMembers';
import ProposalSigners from './ProposalSigners';

// TODO Manage user voting option line 39 

export default function ProposalDetails({ selectedProposal }: { selectedProposal: Proposal }) {
	const creator = useGetUserPartialInfo(selectedProposal.creatorAddress);

	const [tab, setTab] = useState<number>(0);

	// TODO handle user voting
	const handleOnVote = (option: any, pollId: string) => {};

	// TODO add get signer logic
	const handleTabChange = (num: number) => {
		setTab(num);
	};

	return (
		<div className="pl-3">
			<div className="size-22 fw-700 text-light mb-4 mt-3">{selectedProposal.getTitle()}</div>
			<div className="f-column gap-10">
				{creator && <ProposalResume proposal={selectedProposal} creator={creator} />}

				{selectedProposal.details.answers?.length && (
					<Votes
						onVote={handleOnVote}
						options={selectedProposal.details.answers}
						pollId={selectedProposal.id!}
						userVoteOptionId={1}
					/>
				)}
			</div>

			<div className="flex gap-20" style={{ marginTop: 30, marginBottom: 10 }}>
				<Button
					width="73px"
					height={35}
					background={tab !== 0 ? 'var(--white-transparency-10)' : ''}
					children="Voters"
					onClick={() => handleTabChange(0)}
				/>
				<Button
					width="73px"
					height={35}
					background={tab !== 1 ? 'var(--white-transparency-10)' : ''}
					children="Signers"
					onClick={() => handleTabChange(1)}
				/>
			</div>
			{tab === 0 ? (
				<>{creator && <ProposalMembers members={[creator, creator, creator, creator]} />}</>
			) : (
				<>{creator && <ProposalSigners signers={[creator, creator, creator, creator]} />}</>
			)}
		</div>
	);
}
