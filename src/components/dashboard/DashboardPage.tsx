import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';

import DashboardBanner from './DashboardBanner';
import DashboardExplore from './DashboardExplore';
import DashboardLeftMenu from './DashboardLeftMenu';
import Invitations from './Invitations';
import MySides from './MySides';
import Search from './Search';
import { Collection } from '../../models/interfaces/collection';
import { Side } from '../../models/Side';
import { toast } from 'react-toastify';
import { getRandomId } from '../../helpers/utilities';
import { RootState } from '../../redux/store/app.store';
import { useSelector } from 'react-redux';
import { breakpoints, size } from '../../helpers/breakpoints';
import collectionService from '../../services/api-services/collection.service';
import sideService from '../../services/api-services/side.service';
import useGetCollections from '../../hooks/useGetCollections';

const DashboardPageStyled = styled.div`
	display: flex;
	flex-direction: column;
	overflow-y: scroll;
	width: 100%;
	flex-grow: 1;
	min-height: 100vh;
	padding: 0 0 77px 0;
	${breakpoints(
		size.lg,
		`
    {
      padding: 1rem;
    }
  `
	)}
	& > div {
		flex-shrink: 1;
		width: 100%;
		flex-direction: column;
		${breakpoints(
			size.lg,
			`{
      flex-direction: row;
    }`
		)};
		& .current-tab-wrapper {
			width: 100%;
			height: 100%;
			overflow-x: hidden;
			padding: 1rem;
			${breakpoints(
				size.lg,
				`{
        padding: 0 1rem;
      }`
			)}
		}
	}
`;

export interface searchFiltersProps {
	collections?: string;
	elegibility?: string;
	selectedCollection?: string;
	verifiedCollections?: boolean;
}

export const searchFiltersInitialState = {
	collections: '',
	elegibility: 'all',
	selectedCollection: '',
	verifiedCollections: false
};

const tabKeys = {
	explore: '/',
	invitations: '/invitations',
	mySides: '/my-sides',
	search: '/search'
};

export default function DashboardPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const currentTab = location.pathname;

	const [featuredSides, setFeaturedSides] = useState<Side[]>([]);
	const [featureSidesLoading, setFeatureSidesLoading] = useState<boolean>(false);
	const [searchText, setSearchText] = useState<string>('');
	const [searchFilters, setSearchFilters] = useState<searchFiltersProps>(searchFiltersInitialState);

	const { sides } = useSelector((state: RootState) => state.user);

	const collections = useGetCollections();

	useEffect(() => {
		if (searchText || searchFilters.selectedCollection) navigate('/search');
	}, [searchFilters, searchText]);

	useEffect(() => {
		async function getAllFeaturedSides() {
			try {
				setFeatureSidesLoading(true);
				const response = await sideService.getAllFeaturedSides(null, sides);
				setFeaturedSides(response);
			} catch (error) {
				console.error(error);
				toast.error('Ooops! Something went wrong fetching the featured Sides', { toastId: getRandomId() });
			} finally {
				setFeatureSidesLoading(false);
			}
		}
		getAllFeaturedSides();
	}, []);

	return (
		<DashboardPageStyled>
			<DashboardBanner searchText={searchText} setSearchText={setSearchText} />
			<div className="flex w-100 gap-20">
				<DashboardLeftMenu currentTab={currentTab} setSearchText={setSearchText} tabKeys={tabKeys} />

				<div className="current-tab-wrapper flex-5">
					{currentTab === tabKeys.explore && (
						<DashboardExplore
							featureSides={featuredSides}
							featureSidesLoading={featureSidesLoading}
							setSearchFilters={setSearchFilters}
						/>
					)}
					{currentTab === tabKeys.mySides && <MySides collections={collections} />}
					{currentTab === tabKeys.invitations && <Invitations />}
					{currentTab === tabKeys.search && (
						<Search
							collections={collections}
							searchFilters={searchFilters}
							searchText={searchText}
							setSearchFilters={setSearchFilters}
						/>
					)}
				</div>
			</div>
		</DashboardPageStyled>
	);
}
