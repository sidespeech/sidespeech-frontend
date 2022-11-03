import React from 'react'
import styled from 'styled-components'
import { Side } from '../../models/Side';

import FeaturedSides from './FeaturedSides';
import UserCollections from './user-collections/UserCollections';

const DashboardExploreStyles = styled.main`
    width: 
    .sides-list-body {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        max-height: 100%;
        padding: 20px;
    }
    .sides-list-body > div {
        flex: 1 0 15%;
        min-width: 256px;
        max-width: 20%;
        position: relative;
        border-radius: 20px;
        overflow: hidden;
    }
    .sides-list-body img {
        width: 100%;
        height: 260px;
        object-fit: cover;
    }
    
    .join-div {
        display: none;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        background-color: #181A2AE5;
    }
    
    .sides-list-body > div:hover .join-div {
        display: flex;
    }
`

const DashboardExplore = () => {
  return (
    <DashboardExploreStyles>
        <FeaturedSides />

        <UserCollections />
    </DashboardExploreStyles>
  )
}

export default DashboardExplore