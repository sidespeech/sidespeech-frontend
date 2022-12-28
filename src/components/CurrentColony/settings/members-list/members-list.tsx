// import React, { useEffect } from "react";
import styled from 'styled-components';
import _ from 'lodash';
import { Side } from '../../../../models/Side';
import MemberListItem from './MemberListItem';
import { breakpoints, size } from '../../../../helpers/breakpoints';
import CustomSelect from '../../../ui-components/CustomSelect';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store/app.store';
import { Profile, Role } from '../../../../models/Profile';
import { useEffect, useState } from 'react';

const MembersListStyled = styled.div`
	width: 100%;
	${breakpoints(
		size.lg,
		`{
		max-width: 500px;
	}`
	)}
	.header-wrapper {
		display: flex;
		flex-direction: column-reverse;
		${breakpoints(
			size.lg,
			`{
			flex-direction: column;
		}`
		)}
	}
	.permissions-select {
		display: flex;
		align-items: center;
		gap: 1rem;
		justify-content: space-between;
		background-color: var(--input);
		padding: 0.5rem 1rem;
		border-radius: 10px;
		border: 1px solid var(--disable);
		width: 100%;
		${breakpoints(
			size.lg,
			`{
        max-width: 300px;
      }`
		)}
	}
	& .members-table-header {
		width: 100%;
		display: grid;
		grid-template-columns: 4fr 3fr 1fr;
		margin: 1rem 0;
		gap: 1rem;
		align-items: center;
		& .hide-mobile {
			display: none;
			${breakpoints(
				size.lg,
				`{
					display: block;
			}`
			)}
		}
	}
	& .members-table-body {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 1rem 0;
		& .member-item {
			width: 100%;
			display: grid;
			grid-template-columns: 3fr 1fr;
			align-items: center;
			background-color: var(--white-transparency-10);
			border-radius: 10px;
			padding: 0.5rem 1rem 1rem 1rem;
			${breakpoints(
				size.lg,
				`{
				grid-template-columns: 50% 37.5% 12.5%;
				background-color: transparent;
				padding: 0;
			}`
			)}
		}
		& .user-avatar-name {
			padding: 0.5rem;
			grid-column: 1/3;
			${breakpoints(
				size.lg,
				`{
				grid-column: 1/2;
			}`
			)}
		}
		& .eject-btn {
			background-color: rgba(220, 73, 100, 0.15);
			color: var(--red);
			padding: 0 0.5rem;
			height: 30px;
			border-radius: 3px;
		}
		& .remove-btn {
			background-color: var(--green-opacity);
			color: var(--green);
			padding: 0 0.5rem;
			height: 30px;
			border-radius: 3px;
		}
	}
`;

export default function MembersList({ currentSide }: { currentSide: Side }) {
	const { currentProfile } = useSelector((state: RootState) => state.user);

	const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);

	useEffect(() => {
		setFilteredProfiles(_.orderBy(currentSide.profiles, m => m['role']));
	}, []);

	const isAdmin = currentProfile?.role === Role.Admin;

	const handleFilterProfile = (event: any) => {
		const value = event.target.value;
		console.log(value);
		switch (value) {
			case 'all':
				setFilteredProfiles(currentSide.profiles);
				break;
			case 'true':
				setFilteredProfiles(currentSide.profiles.filter(p => !p.isBlacklisted));
				break;
			case 'false':
				setFilteredProfiles(currentSide.profiles.filter(p => p.isBlacklisted));
				break;
			default:
				setFilteredProfiles(currentSide.profiles);
				break;
		}
	};

	return (
		<MembersListStyled className="fade-in">
			<div className="header-wrapper">
				<div className="permissions-select">
					<label>Permission</label>
					<CustomSelect
						arrowPosition={{ right: '-8px' }}
						bgColor="transparent"
						onChange={handleFilterProfile}
						options={['All', 'Active', 'Banned']}
						placeholder=""
						valueToSet={''}
						values={['all', true, false]}
						width="70%"
					/>
				</div>
				<header className="members-table-header">
					<div className="table-title">Members ({currentSide.profiles.length})</div>
					<div className="table-title hide-mobile">Permission</div>
					<div className="table-title hide-mobile">Actions</div>
				</header>
			</div>
			<div className="members-table-body">
				{_.orderBy(filteredProfiles, 'role').map(m => {
					return <MemberListItem key={m.id} user={m} side={currentSide} isAdmin={isAdmin} />;
				})}
			</div>
		</MembersListStyled>
	);
}
