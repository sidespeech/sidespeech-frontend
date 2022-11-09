import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MembersList from "./members-list/members-list"
import Channels from "./channels/channels"
import Invitation from "./invitation/invitation"
import Informations from "./informations/informations"
import Account from "./account/account"
import Eligibility from "./eligibility/eligibility"
import Requests from "./requests/requests"
import "./Settings.css";
import { RootState } from "../../../redux/store/app.store";
import ContainerLeft from "../../ui-components/ContainerLeft";
import TabItems from "../../ui-components/TabItems";
import { apiService } from "../../../services/api.service";
import { setCurrentColony, setSelectedChannel } from "../../../redux/Slices/AppDatasSlice";
import { Dot } from "../../ui-components/styled-components/shared-styled-components";

const initialStateTabs = {
  menu: [
    {
      title: "Settings",
      admin: true,
      items: [
        { active: true, icon: "fa-solid fa-gear", label: "Informations" },
        { active: false, icon: "fa-solid fa-user-group", label: "Members" },
        { active: false, icon: "fa-solid fa-user-plus", label: "Requests" },
        { active: false, icon: "fa-solid fa-bullhorn", label: "Channels" },
        { active: false, icon: "fa-solid fa-circle-plus", label: "Invitation" },
      ],
    },
    {
      title: "Profile",
      admin: false,
      items: [
        { active: false, icon: "fa-solid fa-circle-user", label: "Account" },
        // { active: false, icon: "fa-solid fa-circle-check", label: "Eligibility" }
      ]
    }
  ]

};

export default function Settings(
) {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentSide } = useSelector((state: RootState) => state.appDatas);
  const userData = useSelector((state: RootState) => state.user);

  const [tabs, setTabs] = useState<any>(initialStateTabs);

  // Requests notifications : 
  const [requests, setRequests] = useState<any[]>([]);

  const handleTabs = (tabName: any) => {
    async function getSide() {
      if (currentSide) {
        const res = await apiService.getSideById(currentSide['id']);
        dispatch(setCurrentColony(res));
        dispatch(
          setSelectedChannel(
            res.channels.find((c) => c.type === 0) || res.channels[0]
          )
        );
      }
    }
    getSide();

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
      navigate(`/`);
    } else {
      (userData && userData['currentProfile'] && userData['currentProfile']['role'] === 0) ?
        handleTabs('Informations') : handleTabs('Account');
    }
  }, []);


  // Getting request for display notification :
  const getRequestsUsers = async (requestsOrdered: any[]) => {
    let ids = requestsOrdered.map((invitation: any) => invitation['senderId']);
    const users = (await apiService.getUsersByIds(ids)).reduce((prev: any, current: any, index: number) => {

      let obj = { accounts: '', created_at: '', image: '', id: '', user_id: '' };
      const current_request = requestsOrdered.find(item => item['senderId'] === current['id']);

      obj['accounts'] = current['accounts'];
      obj['created_at'] = current_request['created_at'];
      obj['id'] = current_request['id'];
      obj['user_id'] = current['id'];
      obj['image'] = 'https://images.unsplash.com/photo-1662948291101-691f9fa850d2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80';

      prev.push(obj);

      return prev
    }, []);
    setRequests(users);
  };

  useEffect(() => {
    updateRequestNotifications();
  }, [currentSide, userData]);

  const updateRequestNotifications = async () => {
    if (currentSide && userData && userData['user']) {
      let requestsOrdered = currentSide['invitations'].filter((invitation: any) => invitation['recipientId'] === userData['user']!['id'] && invitation['state'] === 3);
      getRequestsUsers(requestsOrdered);
    }
  }

  return (
    <>
      {currentSide ? (
        <nav>
          <div className="menu-icon">
            <span className="fas fa-bars"></span>
          </div>
          <div className="nav-items text-primary-light">
            <li>
              <i className="fa fa-sliders mr-2"></i>{" "}
              <label className="navTitle"> {currentSide.name} </label>
              <i className="ml-2 fa-solid fa-circle-check collection-icon-check"></i>
            </li>
            <li className="flex">
              <div className="vl"></div> <label>Preference</label>
            </li>
          </div>
          <div className="inputform">
            <input
              type="search"
              className="search-data"
              placeholder="Search"
              required
            />
            <button>
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
          </div>
          <img
            className="avtr"
            src="https://www.w3schools.com/howto/img_avatar2.png"
            alt="Avatar"
          ></img>
        </nav>
      ) : null}

      {currentSide ? (
        <div className="flex align-start w-100 text-left">
          <ContainerLeft>
            {/* <label className="pl-4 sidebar-title">Settings</label> */}
            {tabs["menu"].map((submenu: any, index: number) => {
              return (
                // 
                (submenu['admin'] === true) ?
                  ((userData && userData['currentProfile'] && userData['currentProfile']['role'] === 0) ?
                    ( <div key={index} className="mt-2">
                      <label className="pl-4 sidebar-title">
                        {submenu["title"]}
                      </label>

                      {submenu["items"].map((subtitle: any, index: number) => {
                        return (
                          <>
                            <div>
                              <TabItems cursor="pointeur" key={subtitle['label']} className={`nav-link pl-5 pt-3 pb-3 ${subtitle['active'] ? 'active' : ''} sidebar-item text-secondary-dark`} onClick={(e) => handleTabs(subtitle['label'])}><i className={`${subtitle['icon']} mr-2`}></i>{subtitle['label']}
                              {/* {(subtitle['label'] === 'Requests' && requests.length) ? <Dot>{requests.length}</Dot> : null} */}
                              </TabItems>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  ) : null
                ) : (
                  <div key={index} className="mt-2">
                    <label className="pl-4 sidebar-title">
                      {submenu["title"]}
                    </label>

                    {submenu["items"].map((subtitle: any, index: number) => {
                      return (
                        <TabItems
                          cursor="pointeur"
                          key={subtitle["label"]}
                          className={`nav-link pl-5 pt-3 pb-3 ${
                            subtitle["active"] ? "active" : ""
                          } sidebar-item text-secondary-dark`}
                          onClick={(e) => handleTabs(subtitle["label"])}
                        >
                          <i className={`${subtitle["icon"]} mr-2`}></i>
                          {subtitle["label"]}
                        </TabItems>
                      );
                    })}
                  </div>
                )
              );
            })}
          </ContainerLeft>

          <div className="f-column w-100 pt-3 ml-5 container-tab">
            {tabs["menu"].map((submenu: any, index: number) => {
              return (
                <div key={index}>
                  {submenu['items'].map((subtitle: any, index: number) => {
                    return (
                      (subtitle['label'] == 'Informations' && subtitle['active']) ? <Informations currentSide={currentSide} userData={userData} /> :
                        (subtitle['label'] == 'Members' && subtitle['active']) ? <MembersList currentSide={currentSide} /> :
                          (subtitle['label'] == 'Requests' && subtitle['active']) ? <Requests currentSide={currentSide} userData={userData} updateRequestNotifications={updateRequestNotifications}/> :
                            (subtitle['label'] == 'Channels' && subtitle['active']) ? <Channels currentSide={currentSide} /> :
                              (subtitle['label'] == 'Invitation' && subtitle['active']) ? <Invitation currentSide={currentSide} userData={userData} /> :
                                (subtitle['label'] == 'Account' && subtitle['active']) ? <Account currentSide={currentSide} userData={userData} /> : null
                                  // (subtitle['label'] == 'Eligibility' && subtitle['active']) ? <Eligibility currentSide={currentSide} /> : null
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </>
  );
}
