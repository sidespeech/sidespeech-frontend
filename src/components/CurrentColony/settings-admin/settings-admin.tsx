import React, { useEffect, useState } from "react";
import { Channel, Colony } from "../../../models/Colony";
import { useDispatch, useSelector } from "react-redux";
import { connect, fetchUserDatas } from "../../../redux/Slices/UserDataSlice";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import MembersList from "./members-list/members-list"
import Channels from "./channels/channels"
import Invitation from "./invitation/invitation"
import Informations from "./informations/informations"
import Account from "./account/account"
import Eligibility from "./eligibility/eligibility"
import "./settings-admin.css";
import { RootState } from "../../../redux/store/app.store";
import websocketService from "../../../services/websocket.service";
import { apiService } from "../../../services/api.service";

const ContainerLeft = styled.div`
  min-width: 140px;
  background-color: var(--bg-secondary-light);
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 11px;
  color: var(--text-primary-light);
`;

const TabItems = styled.div`
  cursor: pointer;
  font-family : "Inter", sans-serif;
`;

const initialStateTabs = {
  Informations: true,
  Members: false,
  Channels: false,
  Invitation: false,
  Account: false,
  Eligibility: false
};

export default function SettingsAdmin(
  // { currentSide }: { currentSide: Colony;}
) {

  const dispatch = useDispatch();

  const { currentSide } = useSelector((state: RootState) => state.appDatas);
  const userData = useSelector((state: RootState) => state.user);

  const [tabs, setTabs] = useState<any>(initialStateTabs);

  const handleTabs = (tabName: any) => {
    let currentTabState = { ...tabs }
    for (const key of Object.keys(currentTabState)) { currentTabState[key] = (key === tabName) ? true : false }
    setTabs(currentTabState);
  };

  // useEffect(() => {
  //   websocketService.connectToWebScoket();
  //   async function getUser(account: string) {
  //     const user = await apiService.getUserByAddress(account);
  //     dispatch(connect({ account: account, user: user }));
  //     dispatch(fetchUserDatas(account));
  //   }
  //   const account = localStorage.getItem("userAccount");
  //   if (account) {
  //     getUser(account);
  //   }
  //   return () => {
  //     websocketService.deconnectWebsocket();
  //   };
  // }, []);

  return (
    <>
      { (currentSide) ?
      <div className="flex align-start w-100 text-left">
        <ContainerLeft>
          <TabItems className="pl-2 pt-3 pb-3" onClick={(e) => handleTabs("Informations")}><i className="fa-solid fa-gear mr-2"></i>Informations</TabItems>
          <TabItems className="pl-2 pt-3 pb-3" onClick={(e) => handleTabs("Members")}><i className="fa-solid fa-user-group mr-2 pl-2"></i>Members</TabItems>
          <TabItems className="pl-2 pt-3 pb-3" onClick={(e) => handleTabs("Channels")}><i className="fa-solid fa-bullhorn mr-2 pl-2"></i>Channels</TabItems>
          <TabItems className="pl-2 pt-3 pb-3" onClick={(e) => handleTabs("Invitation")}><i className="fa-solid fa-circle-plus mr-2 pl-2"></i>Invitation</TabItems>
          <TabItems className="pl-2 pt-3 pb-3" onClick={(e) => handleTabs("Account")}><i className="fa-solid fa-circle-user mr-2 pl-2"></i>Account</TabItems>
          <TabItems className="pl-2 pt-3 pb-3" onClick={(e) => handleTabs("Eligibility")}><i className="fa-solid fa-circle-check mr-2 pl-2"></i>Eligibility</TabItems>
        </ContainerLeft>

        <div className="f-column w-100 pt-3 ml-5">
          {Object.keys(tabs).map((keyName, i) =>
            (keyName == 'Informations' && tabs[keyName]) ? <Informations currentSide={currentSide} /> :
              (keyName == 'Members' && tabs[keyName]) ? <MembersList currentSide={currentSide} /> :
                (keyName == 'Channels' && tabs[keyName]) ? <Channels currentSide={currentSide} /> :
                  (keyName == 'Invitation' && tabs[keyName]) ? <Invitation currentSide={currentSide} /> :
                  (keyName == 'Account' && tabs[keyName]) ? <Account currentSide={currentSide} userData={userData} /> :
                  (keyName == 'Eligibility' && tabs[keyName]) ? <Eligibility currentSide={currentSide} /> : null
          )}
        </div>

      </div> : null
    }

    </>
  );
}
