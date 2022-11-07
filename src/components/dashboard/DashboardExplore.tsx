import React from 'react';
import styled from 'styled-components';

import FeaturedSides from './FeaturedSides';
import UserCollections from './user-collections/UserCollections';

const DashboardExploreStyles = styled.main`

`;

const DashboardExplore = () => {
  return (
    <DashboardExploreStyles>
        <FeaturedSides />
        <UserCollections />
    </DashboardExploreStyles>
  )
}

export default DashboardExplore