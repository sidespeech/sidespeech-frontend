import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store/app.store";
import { Outlet } from "react-router-dom";

// Components
import GeneralSettingsMenu from "./components/GeneralSettings/ContainerLeft/Index";
import UserColonies from "./components/UserColonies/UserColonies";
import SidesList from "./components/SidesList";

// Images
import logoSmall from "./assets/logo.svg";

import websocketService from "./services/websocket.service";

// Redux
import { connect, fetchUserDatas } from "./redux/Slices/UserDataSlice";

// API's
import { apiService } from "./services/api.service";

function App() {
  const userData = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();

  // This is used to detect we are in the general settings.
  let generalSettings = false;

  useEffect(() => {
    let account = localStorage.getItem("userAccount") || null;

    websocketService.connectToWebSocket();
    async function getUser(account: string) {
      const user = await apiService.getUserByAddress(account);
      dispatch(connect({ account: account, user: user }));
      dispatch(fetchUserDatas(account));
    }
    if (!!window.ethereum?.selectedAddress) {
      account = window.ethereum.selectedAddress;
    }

    if (account) {
      getUser(account);
    }
    return () => {
      websocketService.deconnectWebsocket();
    };
  }, []);

  // Conditional for checking if we are the settings page as we need a different sidebar.
  if (location.pathname.indexOf("/general-settings") > -1) {
    generalSettings = true;
  }

  return (
    <div className="main-container relative">
      {!generalSettings ? (
        <div className="left-container">
          <div>{userData.user && <UserColonies />}</div>
          <Link to={"/general-settings"}>
            {" "}
            <div>
              <img width={45} height={45} src={logoSmall} alt="logo-small" />
            </div>
          </Link>
        </div>
      ) : (
        <div className="left-container global">
          <GeneralSettingsMenu />
        </div>
      )}
      {!generalSettings ? (
        <div className="middle-container f-column align-center justify-center">
          <Outlet></Outlet>
        </div>
      ) : (
        <div className="general-settings">
          <Outlet></Outlet>
        </div>
      )}
    </div>
  );
}

export default App;
