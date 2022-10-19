import React, { useEffect, useState } from "react";
import { Channel, Colony } from "../../../models/Colony";
import { useDispatch, useSelector } from "react-redux";
import { connect, fetchUserDatas } from "../../../redux/Slices/UserDataSlice";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import MembersList from "./members-list/members-list"
import Channels from "./channels/channels"
import Invitation from "./invitation/invitation"
import Informations from "./informations/informations"
import Account from "./account/account"
import Eligibility from "./eligibility/eligibility"
import "./settings.css";
import { RootState } from "../../../redux/store/app.store";
import websocketService from "../../../services/websocket.service";
import { apiService } from "../../../services/api.service";

const ContainerLeft = styled.div`
  min-width: 200px;
  height: 92vh;
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
  menu: [
    {
      title: 'Settings',
      admin: true,
      items: [
        { active: true, icon: "fa-solid fa-gear", label: "Informations" },
        { active: false, icon: "fa-solid fa-user-group", label: "Members" },
        { active: false, icon: "fa-solid fa-bullhorn", label: "Channels" },
        { active: false, icon: "fa-solid fa-circle-plus", label: "Invitation" },
      ]
    },
    {
      title: 'Profile',
      admin: false,
      items: [
        { active: false, icon: "fa-solid fa-circle-user", label: "Account" },
        { active: false, icon: "fa-solid fa-circle-check", label: "Eligibility" }
      ]
    }
  ]

};

export default function SettingsAdmin(
  // { currentSide }: { currentSide: Colony;}
) {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentSide } = useSelector((state: RootState) => state.appDatas);
  const userData = useSelector((state: RootState) => state.user);

  const [tabs, setTabs] = useState<any>(initialStateTabs);

  const handleTabs = (tabName: any) => {
    let currentTabState = { ...tabs }
    for (const submenu of tabs['menu']) {
      for (const data of submenu['items']) {
        data['active'] = (data['label'] === tabName) ? true : false
      }
    }
    setTabs(currentTabState);
  };

  useEffect(() => {
    if (!currentSide) {
      navigate(`/`)
    } else {
      (currentSide && currentSide['creatorAddress'] === userData['account']) ? 
      handleTabs('Informations') : handleTabs('Account'); 
    }
  }, []);

  return (
    <>
      {(currentSide) ?
        <nav>
          <div className="menu-icon">
            <span className="fas fa-bars"></span>
          </div>
          <div className="nav-items text-primary-light">
            <li><i className="fa fa-sliders mr-2"></i> <label className='navTitle'> {currentSide.name} </label><i className="ml-2 fa-solid fa-circle-check collection-icon-check"></i></li>
            <li className='flex'><div className="vl"></div> <label>Preference</label></li>
          </div>
          <div className='inputform'>
            <input type="search" className="search-data" placeholder="Search" required />
            <button><i className="fa fa-search" aria-hidden="true"></i></button>
          </div>
          <img className='avtr' src="https://www.w3schools.com/howto/img_avatar2.png" alt="Avatar"></img>
        </nav> : null}


      {(currentSide) ?
        <div className="flex align-start w-100 text-left">
          <ContainerLeft>
            {/* <label className="pl-4 sidebar-title">Settings</label> */}
            {tabs['menu'].map((submenu: any, index: number) => {
              return (
                // 
                (submenu['admin'] === true) ?
                  (currentSide['creatorAddress'] === userData['account']) ?
                    <div key={index} className="mt-2">
                      <label className="pl-4 sidebar-title">{submenu['title']}</label>

                      {submenu['items'].map((subtitle: any, index: number) => {
                        return (
                          <TabItems key={subtitle['label']} className={`nav-link pl-5 pt-3 pb-3 ${subtitle['active'] ? 'active' : ''} sidebar-item text-secondary-dark`} onClick={(e) => handleTabs(subtitle['label'])}><i className={`${subtitle['icon']} mr-2`}></i>{subtitle['label']}</TabItems>
                        );
                      })}
                    </div> : null :
                  <div key={index} className="mt-2">
                    <label className="pl-4 sidebar-title">{submenu['title']}</label>

                    {submenu['items'].map((subtitle: any, index: number) => {
                      return (
                        <TabItems key={subtitle['label']} className={`nav-link pl-5 pt-3 pb-3 ${subtitle['active'] ? 'active' : ''} sidebar-item text-secondary-dark`} onClick={(e) => handleTabs(subtitle['label'])}><i className={`${subtitle['icon']} mr-2`}></i>{subtitle['label']}</TabItems>
                      );
                    })}
                  </div>
              );
            })}
          </ContainerLeft>

          <div className="f-column w-100 pt-3 ml-5">
            {tabs['menu'].map((submenu: any, index: number) => {
              return (
                <div key={index}>
                  {submenu['items'].map((subtitle: any, index: number) => {
                    return (
                      (subtitle['label'] == 'Informations' && subtitle['active']) ? <Informations currentSide={currentSide} /> :
                        (subtitle['label'] == 'Members' && subtitle['active']) ? <MembersList currentSide={currentSide} /> :
                          (subtitle['label'] == 'Channels' && subtitle['active']) ? <Channels currentSide={currentSide} /> :
                            (subtitle['label'] == 'Invitation' && subtitle['active']) ? <Invitation currentSide={currentSide} /> :
                              (subtitle['label'] == 'Account' && subtitle['active']) ? <Account currentSide={currentSide} userData={userData} /> :
                                (subtitle['label'] == 'Eligibility' && subtitle['active']) ? <Eligibility currentSide={currentSide} /> : null
                    );
                  })}
                </div>
              );
            })}
          </div>

        </div> : null
      }

    </>
  );
}
