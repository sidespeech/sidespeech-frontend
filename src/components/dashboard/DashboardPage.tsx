import React, { useEffect, useState } from "react";
import styled from 'styled-components'
import { useLocation, useNavigate } from "react-router-dom";

import DashboardBanner from "./DashboardBanner";
import DashboardExplore from "./DashboardExplore";
import DashboardLeftMenu from "./DashboardLeftMenu";
import Invitations from "./Invitations";
import MySides from "./MySides";
import Search from "./Search";

const DashboardPageStyled = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  width: 100%;
  min-height: 100vh;
  & > div {
    flex-shrink: 1;
    width: 100%;
    & .current-tab-wrapper {
      width: 100%;
      height: 100%;
      padding: 0 1rem;
      overflow-x: hidden;
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
  elegibility: '',
  selectedCollection: '',
  verifiedCollections: false
}

const tabKeys = {
  explore: '/',
  invitations: '/invitations',
  mySides: '/my-sides',
  search: '/search'
}

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = location.pathname;

  const [searchText, setSearchText] = useState<string>('');
  const [searchFilters, setSearchFilters] = useState<searchFiltersProps>(searchFiltersInitialState);

  useEffect(() => {
    if (searchText || searchFilters.selectedCollection) navigate('/search');
  }, [searchFilters, searchText]);

  return (
    <DashboardPageStyled className="w-100 px-4 py-4">
      <DashboardBanner searchText={searchText} setSearchText={setSearchText} />
      <div className="flex w-100 gap-20">
        <DashboardLeftMenu currentTab={currentTab} tabKeys={tabKeys} />

        <div className="current-tab-wrapper flex-5">
          {currentTab === tabKeys.explore && (
            <DashboardExplore 
              setSearchFilters={setSearchFilters} 
            />
          )}
          {currentTab === tabKeys.mySides && <MySides />}
          {currentTab === tabKeys.invitations && <Invitations />}
          {currentTab === tabKeys.search && (
            <Search 
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
