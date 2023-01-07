import React, { useEffect, useState } from 'react';
import { Proposal, Status } from '../../../../models/Proposal';
import Button from '../../../ui-components/Button';
import ProposalComponentItem from './ProposalComponentItem';

interface IProposalComponentListProps {
	proposals: Proposal[];
}

export default function ProposalComponentList(props: IProposalComponentListProps) {
	return (
		<div className="f-column gap-15">
			{props.proposals.map(proposal => {
				return <ProposalComponentItem proposal={proposal} key={proposal.id} />;
			})}
		</div>
	);
}
