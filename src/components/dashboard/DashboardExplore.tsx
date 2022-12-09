import React from 'react';
import styled from 'styled-components';
import { Side } from '../../models/Side';
import { searchFiltersProps } from './DashboardPage';

import FeaturedSides from './FeaturedSides';
import UserCollections from './user-collections/UserCollections';

const DashboardExploreStyles = styled.main``;

interface DashboardExploreProps {
	featureSides: Side[];
	featureSidesLoading: boolean;
	setSearchFilters: React.Dispatch<React.SetStateAction<searchFiltersProps>>;
}

const DashboardExplore = ({ featureSides, featureSidesLoading, setSearchFilters }: DashboardExploreProps) => {
	//@ts-ignore
	tokenproof.on('nonce', e => {
		console.log('new nonce generated: ', e);
	});
	//@ts-ignore
	tokenproof.on('verified', e => {
		console.log('result: ', e);
	});
	const handletokenproofconnection = async () => {
		//@ts-ignore
		await tokenproof.login({ appId: 'blablabla', env: 'development' });
	};
	return (
		<DashboardExploreStyles>
			<button onClick={handletokenproofconnection}>tokenproof</button>
			<FeaturedSides featuredSides={featureSides} sidesLoading={featureSidesLoading} />
			<UserCollections setSearchFilters={setSearchFilters} />
		</DashboardExploreStyles>
	);
};

export default DashboardExplore;
