import React, { useEffect, useState } from "react";
import styled from 'styled-components'
import { useLocation, useNavigate } from "react-router-dom";

import DashboardBanner from "./DashboardBanner";
import DashboardExplore from "./DashboardExplore";
import DashboardLeftMenu from "./DashboardLeftMenu";
import Invitations from "./Invitations";
import MySides from "./MySides";
import Search from "./Search";
import { apiService } from "../../services/api.service";
import { Collection } from "../../models/interfaces/collection";
import { Side } from "../../models/Side";
import { sideAPI } from "../../services/side.service";
import { toast } from "react-toastify";
import { getRandomId } from "../../helpers/utilities";

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

  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  const [featuredSides, setFeaturedSides] = useState<Side[]>([]);
  const [featureSidesLoading, setFeatureSidesLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [searchFilters, setSearchFilters] = useState<searchFiltersProps>(searchFiltersInitialState);

  useEffect(() => {
    if (searchText || searchFilters.selectedCollection) navigate('/search');
  }, [searchFilters, searchText]);

  useEffect(() => {
    async function getAllFeaturedSides() {
        try {
            setFeatureSidesLoading(true);
            const response = await sideAPI.getAllFeaturedSides();
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

  useEffect(() => {
    const getCollections = async () => {
      const response = await apiService.getAllCollections();
      setAllCollections(response);      
    };
    getCollections();
  }, []);

  return (
    <DashboardPageStyled className="w-100 px-4 py-4">
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
          {currentTab === tabKeys.mySides && <MySides collections={allCollections} />}
          {currentTab === tabKeys.invitations && <Invitations />}
          {currentTab === tabKeys.search && (
            <Search 
              collections={allCollections}
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
