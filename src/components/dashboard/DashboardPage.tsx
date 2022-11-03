import React from "react";
import styled from 'styled-components'
import { useLocation } from "react-router-dom";

import DashboardBanner from "./DashboardBanner";
import DashboardExplore from "./DashboardExplore";
import DashboardLeftMenu from "./DashboardLeftMenu";
import Invitations from "./Invitations";
import MySides from "./MySides";

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
      overflow-x: hidden;
    }
  }
`;

const tabKeys = {
  explore: '/',
  mySides: '/my-sides',
  invitations: '/invitations'
}

export default function DashboardPage() {
  const location = useLocation();
  const currentTab = location.pathname;

  return (
    <DashboardPageStyled className="w-100 px-4 py-4">
      <DashboardBanner />
      <div className="flex w-100 gap-20">
        <DashboardLeftMenu currentTab={currentTab} tabKeys={tabKeys} />

        <div className="current-tab-wrapper flex-5">
          {currentTab === tabKeys.explore && <DashboardExplore />}
          {currentTab === tabKeys.mySides && <MySides />}
          {currentTab === tabKeys.invitations && <Invitations />}
        </div>
      </div>
    </DashboardPageStyled>
  );
}
