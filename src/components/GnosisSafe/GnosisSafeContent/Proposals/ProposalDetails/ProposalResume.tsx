import moment from 'moment';
import React from 'react';
import { Proposal } from '../../../../../models/Proposal';
import { User } from '../../../../../models/User';
import UserBadge from '../../../../ui-components/UserBadge';

export default function ProposalResume({ proposal, creator }: { proposal: Proposal; creator: Partial<User> }) {
	return (
		<>
			<UserBadge
				width={24}
				username={creator.username}
				avatar={creator.userAvatar?.metadata.image}
				weight={700}
				fontSize={14}
				color={'#E03453'}
			/>
			<div>
				<span className="text-light-30 mr-2">
					Posted the {moment.utc(proposal.creationDate).format('DD-MM-YYYY')}
				</span>
				<span className="text-green">
					<i className="icon-event_available-1 mr-1"></i>
					Completed the {moment.utc(proposal.endDate).format('DD-MM-YYYY')}
				</span>
			</div>
			<div>{proposal.details.description}</div>
		</>
	);
}
