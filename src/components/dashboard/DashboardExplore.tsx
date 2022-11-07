import React from 'react';
import styled from 'styled-components';
import { searchFiltersProps } from './DashboardPage';

import FeaturedSides from './FeaturedSides';
import UserCollections from './user-collections/UserCollections';

const DashboardExploreStyles = styled.main`

`;

interface DashboardExploreProps {
  setSearchFilters: React.Dispatch<React.SetStateAction<searchFiltersProps>>;
}

const DashboardExplore = ({setSearchFilters}: DashboardExploreProps) => {
  return (
    <DashboardExploreStyles>
        <FeaturedSides />
        <UserCollections setSearchFilters={setSearchFilters} />
    </DashboardExploreStyles>
  )
}

export default DashboardExplore