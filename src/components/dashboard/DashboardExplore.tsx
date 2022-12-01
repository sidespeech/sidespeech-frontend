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
	return (
		<DashboardExploreStyles>
			<FeaturedSides featuredSides={featureSides} sidesLoading={featureSidesLoading} />
			<UserCollections setSearchFilters={setSearchFilters} />
		</DashboardExploreStyles>
	);
};

export default DashboardExplore;
