import React from 'react';
import { User } from '../../../models/User';
import { Chip } from '../../ui-components/styled-components/shared-styled-components';
import UserBadge from '../../ui-components/UserBadge';

// TODO when data are not going to be hardcoded anymore, we can remove creator from the component's props

export default function ProposalMembers({ members }: { members: Partial<User>[] }) {
	return (
		<div className="f-column gap-10">
			<div className="flex">
				<div style={{ flex: '6 0 0' }}>Member</div>
				<div style={{ flex: '1 0 0', textAlign: 'right' }}>Power</div>
				<div style={{ flex: '1 0 0', textAlign: 'right' }}>Vote</div>
			</div>
			{members.map(m => {
				return (
					<div className="flex">
						<div style={{ flex: '6 0 0' }}>
							<UserBadge
								width={27}
								fontSize={12}
								avatar={m?.userAvatar?.metadata.image}
								weight={400}
								username={m?.username}
							/>
						</div>
						<div style={{ flex: '1 0 0', textAlign: 'right' }}>0.76%</div>
						<div style={{ flex: '1 0 0', textAlign: 'right' }}>
							<Chip
								backgroundColor="var(--white-transparency-10)"
								borderRadius="5px"
								fontSize="10px"
								fontWeight={700}
								height={20}
								padding="3px 6px"
							>
								#1
							</Chip>
						</div>
					</div>
				);
			})}
		</div>
	);
}
