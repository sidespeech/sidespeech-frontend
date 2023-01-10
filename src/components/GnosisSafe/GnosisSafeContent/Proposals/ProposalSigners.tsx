import React from 'react';
import { User } from '../../../../models/User';
import { Chip } from '../../../ui-components/styled-components/shared-styled-components';
import UserBadge from '../../../ui-components/UserBadge';

export default function ProposalSigners({ signers }: { signers: Partial<User>[] }) {
	return (
		<div className="f-column gap-10">
			{signers.map((s, index) => {
				//TODO change hardcoded logic to know if user has sign the proposal
				const hasSigned = index % 2 === 0;
				const isVerified = index % 3 === 0;
				return (
					<div className="flex align-center justify-between">
						<div className="flex gap-10 align-center">
							<UserBadge
								width={27}
								fontSize={12}
								avatar={s?.userAvatar?.metadata.image}
								weight={400}
								username={s?.username}
							/>
							{isVerified && <i className="icon-green-verified text-green"></i>}
							<span className="text-yellow fw-700">Sub-admin</span>
						</div>
						{hasSigned ? (
							<Chip
								backgroundColor="var(--green-opacity)"
								color="var(--green)"
								borderRadius="5px"
								fontSize="10px"
								fontWeight={700}
								height={20}
								padding="3px 6px"
							>
								APPROVED
							</Chip>
						) : (
							<div className="text-light-30 size-10 fw-700">Waiting...</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
