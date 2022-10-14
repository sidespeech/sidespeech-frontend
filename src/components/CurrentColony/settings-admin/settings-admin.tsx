import React, { useEffect, useState } from "react";
import { Channel, Colony } from "../../../models/Colony";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import MembersList from "./members-list/members-list"
import Channels from "./channels/channels"
import Invitation from "./invitation/invitation"
import Informations from "./informations/informations"
import "./settings-admin.css";

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
  Invitation: false
};

export default function SettingsAdmin(
  // { currentSide }: { currentSide: Colony;}
) {

  const dispatch = useDispatch();


  const { state } = useLocation();
  const { currentSide } = state; // Read values passed on state

  const [tabs, setTabs] = useState<any>(initialStateTabs);

  const handleTabs = (tabName: any) => {
    let currentTabState = { ...tabs }
    for (const key of Object.keys(currentTabState)) { currentTabState[key] = (key === tabName) ? true : false }
    console.log('tabName :', tabName);
    console.log("currentTabState :", currentTabState)
    setTabs(currentTabState);
  };

  useEffect(() => {
    console.log('currentSide:', currentSide)
  });

  return (
    <>
      <div className="flex align-start w-100 text-left">
        <ContainerLeft>
          <TabItems className="pl-2 pt-3 pb-3 align-center justify-center" onClick={(e) => handleTabs("Informations")}><i className="fa-solid fa-gear mr-2"></i>Informations</TabItems>
          <TabItems className="pl-2 pt-3 pb-3" onClick={(e) => handleTabs("Members")}><i className="fa-solid fa-user-group mr-2 pl-2"></i>Members</TabItems>
          <TabItems className="pl-2 pt-3 pb-3" onClick={(e) => handleTabs("Channels")}><i className="fa-solid fa-bullhorn mr-2 pl-2"></i>Channels</TabItems>
          <TabItems className="pl-2 pt-3 pb-3" onClick={(e) => handleTabs("Invitation")}><i className="fa-solid fa-circle-plus mr-2 pl-2"></i>Invitation</TabItems>


        </ContainerLeft>
        <div className="f-column w-100 pt-3">
          {Object.keys(tabs).map((keyName, i) =>
            (keyName == 'Informations' && tabs[keyName]) ? <Informations currentSide={currentSide} /> :
              (keyName == 'Members' && tabs[keyName]) ? <MembersList currentSide={currentSide} /> :
                (keyName == 'Channels' && tabs[keyName]) ? <Channels currentSide={currentSide} /> :
                  (keyName == 'Invitation' && tabs[keyName]) ? <Invitation currentSide={currentSide} /> : null
          )}
        </div>

      </div>

    </>
  );
}
